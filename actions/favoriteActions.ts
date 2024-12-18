// actions/favoriteActions.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import UserModel from "@/models/userModel";
import connectDB from "@/config/database";
import mongoose from "mongoose";

export async function toggleFavorite(showId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    // Find or create user
    let dbUser = await UserModel.findOne({ clerkId: user.id });

    if (!dbUser) {
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );

      dbUser = await UserModel.create({
        clerkId: user.id,
        email: primaryEmail?.emailAddress || "",
        favorites: [],
      });
    }

    const showObjectId = new mongoose.Types.ObjectId(showId);
    const isFavorited = dbUser.favorites.some((id) => id.equals(showObjectId));

    if (isFavorited) {
      dbUser.favorites = dbUser.favorites.filter((id) => !id.equals(showObjectId));
    } else {
      dbUser.favorites.push(showObjectId);
    }

    await dbUser.save();

    return { success: true, isFavorited: !isFavorited };
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    return { error: "Failed to update favorites" };
  }
}

export async function getFavorites() {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const dbUser = await UserModel.findOne({ clerkId: user.id }).populate("favorites").lean();

    if (!dbUser) {
      return { data: [] };
    }

    return { data: dbUser.favorites };
  } catch (error) {
    console.error("Error in getFavorites:", error);
    return { error: "Failed to fetch favorites" };
  }
}

export async function batchCheckFavorites(showIds: string[]) {
  try {
    const user = await currentUser();

    if (!user) {
      return { favoriteMap: {} };
    }

    await connectDB();

    const dbUser = await UserModel.findOne({ clerkId: user.id });

    if (!dbUser) {
      return {
        favoriteMap: showIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
      };
    }

    const favoriteMap = showIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: dbUser.favorites.some((favId) => favId.equals(new mongoose.Types.ObjectId(id))),
      }),
      {}
    );

    return { favoriteMap };
  } catch (error) {
    console.error("Error in batchCheckFavorites:", error);
    return { error: "Failed to check favorites" };
  }
}
