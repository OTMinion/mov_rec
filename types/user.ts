// types/user.ts
import { Types } from "mongoose";

export type ContentType = "movie" | "tv";

export interface Favorite {
  contentId: Types.ObjectId;
  contentType: ContentType;
}

export interface UserFavorites {
  favorites: Favorite[];
}
