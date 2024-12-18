// actions/emotionActions.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import PostModel from "@/models/postModel";
import type { Emotion } from "@/models/postModel";
import connectDB from "@/config/database";
import mongoose from "mongoose";

interface EmotionUpdateResponse {
  success?: boolean;
  emotions?: Emotion[];
  error?: string;
}

interface ShowsResponse {
  data?: any[];
  total?: number;
  currentPage?: number;
  totalPages?: number;
  error?: string;
}

export async function updateShowEmotions(showId: string): Promise<EmotionUpdateResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const show = await PostModel.findById(showId).lean();
    if (!show) {
      return { error: "Show not found" };
    }

    // Import your emotion classifier function
    const { classifyShowEmotions } = await import("@/utils/emotionClassifier");

    const emotions = classifyShowEmotions({
      overview: show.overview,
      name: show.name,
      genre_ids: show.genre_ids,
      vote_average: show.vote_average,
      original_language: show.original_language,
    });

    const updatedShow = await PostModel.findByIdAndUpdate(
      showId,
      { $set: { emotions } },
      { new: true }
    ).lean();

    if (!updatedShow) {
      return { error: "Failed to update show" };
    }

    return { success: true, emotions };
  } catch (error) {
    console.error("Error updating show emotions:", error);
    return { error: "Failed to update emotions" };
  }
}

export async function getShowsByEmotion(
  emotion: Emotion,
  page: number = 1,
  itemsPerPage: number = 20
): Promise<ShowsResponse> {
  try {
    await connectDB();

    // Get total count for this emotion
    const total = await PostModel.countDocuments({
      emotions: emotion,
    });

    const shows = await PostModel.find({
      emotions: emotion,
    })
      .sort({ popularity: -1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    return {
      data: shows.map((show) => ({
        ...show,
        _id: show._id.toString(),
      })),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    console.error("Error fetching shows by emotion:", error);
    return { error: "Failed to fetch shows" };
  }
}

export async function getAllEmotions(): Promise<Emotion[]> {
  return [
    "happy",
    "sad",
    "excited",
    "romantic",
    "mysterious",
    "tense",
    "fearful",
    "angry",
    "reflective",
    "chill",
    "sleepy",
    "weird",
    "lonely",
    "thoughtful",
    "playful",
    "emotional",
  ];
}

export async function isFavorited(showId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { isFavorited: false };
    }

    await connectDB();

    const show = await PostModel.findOne({
      _id: new mongoose.Types.ObjectId(showId),
      emotions: { $exists: true, $ne: [] },
    });

    return { isFavorited: !!show };
  } catch (error) {
    console.error("Error in isFavorited:", error);
    return { error: "Failed to check favorite status" };
  }
}
