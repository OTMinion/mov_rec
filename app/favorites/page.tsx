// app/favorites/page.tsx
import { getFavorites } from "@/actions/favoriteActions";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import FavoriteButton from "@/components/FavoriteButton";
import Movie from "@/models/Movie";
import TVSeries from "@/models/TV";
import connectDB from "@/config/database";
import { ContentItem, GetFavoritesResponse } from "@/types/content";

async function getFavoriteContent(favoriteIds: string[]): Promise<ContentItem[]> {
  await connectDB();

  const [movies, tvShows] = await Promise.all([
    Movie.find({ _id: { $in: favoriteIds } })
      .select("_id id type title originalTitle releaseDate voteAverage images")
      .lean(),
    TVSeries.find({ _id: { $in: favoriteIds } })
      .select("_id id type title originalTitle releaseDate voteAverage images")
      .lean(),
  ]);

  return [...movies, ...tvShows].map((item) => ({
    _id: String(item._id),
    id: item.id,
    type: item.type as "movie" | "tv",
    title: item.title,
    originalTitle: item.originalTitle,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage,
    images: item.images,
  }));
}

export default async function FavoritesPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const response: GetFavoritesResponse = await getFavorites();

  if (response.error || !response.data) {
    return <p className="p-8 text-red-500">Error loading favorites: {response.error}</p>;
  }

  const favoriteIds = response.data.map((id) => id.toString());
  const favorites = await getFavoriteContent(favoriteIds);
  const showIds = favorites.map((item) => item._id);

  return (
    <FavoritesProvider initialShowIds={showIds}>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((item) => (
              <div key={item._id} className="relative">
                <Link
                  href={`/${item.type}s/${item._id}`}
                  className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full aspect-[2/3]">
                    {item.images?.posters?.[0] || item.images?.backdrops?.[0] ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${
                          item.images.posters?.[0] || item.images.backdrops?.[0]
                        }`}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg hover:text-blue-600 line-clamp-1 mt-2">
                    {item.title}
                  </h3>
                  <div className="mt-2 text-sm">
                    {item.voteAverage && <span>⭐ {item.voteAverage.toFixed(1)} • </span>}
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                </Link>
                <div className="absolute top-6 right-6">
                  <FavoriteButton showId={item._id.toString()} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorites yet</p>
        )}
      </main>
    </FavoritesProvider>
  );
}
