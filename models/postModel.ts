// models/postModel.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export type Emotion =
  | "happy"
  | "sad"
  | "excited"
  | "romantic"
  | "mysterious"
  | "tense"
  | "fearful"
  | "angry"
  | "reflective"
  | "chill"
  | "sleepy"
  | "weird"
  | "lonely"
  | "thoughtful"
  | "playful"
  | "emotional";

export interface IPost extends Document {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  overview_embedding?: number[];
  emotions: Emotion[];
}

export interface IPostLean {
  _id: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  emotions: Emotion[];
}

const postSchema = new Schema<IPost>(
  {
    adult: { type: Boolean, required: true },
    backdrop_path: { type: String, required: true },
    genre_ids: { type: [Number], required: true },
    id: { type: Number, unique: true, required: true },
    origin_country: { type: [String], required: true },
    original_language: { type: String, required: true },
    original_name: { type: String, required: true },
    overview: { type: String, required: true },
    popularity: { type: Number, required: true },
    poster_path: { type: String, required: true },
    first_air_date: { type: String, required: true },
    name: { type: String, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    overview_embedding: { type: [Number], required: false },
    emotions: {
      type: [String],
      enum: [
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
      ],
      default: [],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const PostModel: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
export default PostModel;
