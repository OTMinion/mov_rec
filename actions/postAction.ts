"use server";

import { ContentItem, GetPostsResponse } from "@/types/content";
import Movie from "@/models/Movie";
import TVSeries from "@/models/TV";
import connectDB from "@/config/database";

function transformToContentItem(item: any): ContentItem {
  return {
    _id: item._id,
    id: Number(item.id),
    type: item.type,
    title: item.title,
    originalTitle: item.originalTitle,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage,
    popularity: item.popularity,
    images: item.images,
  };
}

export async function getPosts(
  page: number = 1,
  itemsPerPage: number = 20,
  type?: string
): Promise<GetPostsResponse> {
  try {
    await connectDB();
    const skip = (page - 1) * itemsPerPage;
    // Add popularity to fields since we need it for sorting
    const fields = "id title originalTitle releaseDate voteAverage popularity images type";

    if (type === "movie") {
      const total = await Movie.countDocuments({ type: "movie" });
      const rawData = await Movie.find({ type: "movie" })
        .select(fields)
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .lean();
      const data = rawData.map(transformToContentItem);
      return { data, total, error: null };
    } else if (type === "tv") {
      const total = await TVSeries.countDocuments({ type: "tv" });
      const rawData = await TVSeries.find({ type: "tv" })
        .select(fields)
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .lean();
      const data = rawData.map(transformToContentItem);
      return { data, total, error: null };
    } else {
      const [moviesRaw, tvShowsRaw, movieCount, tvCount] = await Promise.all([
        Movie.find()
          .select(fields)
          .sort({ popularity: -1 })
          .skip(skip / 2)
          .limit(itemsPerPage / 2)
          .lean(),
        TVSeries.find()
          .select(fields)
          .sort({ popularity: -1 })
          .skip(skip / 2)
          .limit(itemsPerPage / 2)
          .lean(),
        Movie.countDocuments(),
        TVSeries.countDocuments(),
      ]);

      // Sort by popularity before transforming, and provide a default value of 0
      const data = [...moviesRaw, ...tvShowsRaw]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .map(transformToContentItem);

      return { data, total: movieCount + tvCount, error: null };
    }
  } catch (error) {
    console.error("Error in getPosts:", error);
    return { data: [], total: 0, error };
  }
}
