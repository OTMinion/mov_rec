// types/content.ts
import { Types } from "mongoose";

export interface ContentItem {
  _id: string;
  id: number;
  type: "movie" | "tv";
  title: string;
  originalTitle?: string;
  releaseDate?: string;
  voteAverage?: number;
  popularity?: number;
  images?: {
    posters?: string[];
    backdrops?: string[];
  };
}

export interface GetPostsResponse {
  data: ContentItem[];
  total: number;
  error: any;
}

export interface GetFavoritesResponse {
  data?: Types.ObjectId[] | null;
  error?: string | null;
}
export interface FavoriteContent extends ContentItem {
  popularity: number;
}
