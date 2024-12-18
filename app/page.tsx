import { getPosts } from "@/actions/postAction";
import { ContentItem } from "@/types/content";
import SearchBar from "@/components/SearchBar";
import FavoriteButton from "@/components/FavoriteButton";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const ITEMS_PER_PAGE = 20;

interface PageProps {
  searchParams: {
    page?: string;
    type?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const currentPage = Number(params?.page) || 1;
  const contentType = params?.type as "movie" | "tv" | undefined;

  const { data, total, error } = await getPosts(currentPage, ITEMS_PER_PAGE, contentType);
  const showIds = data ? data.map((item) => item._id.toString()) : [];

  return (
    <FavoritesProvider initialShowIds={showIds}>
      <main className="p-8">
        <div className="mb-8 space-y-4">
          <SearchBar />
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded ${
                !contentType ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              All
            </Link>
            <Link
              href="/?type=movie"
              className={`px-4 py-2 rounded ${
                contentType === "movie" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Movies
            </Link>
            <Link
              href="/?type=tv"
              className={`px-4 py-2 rounded ${
                contentType === "tv" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              TV Shows
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500">Error loading content: {error.message}</p>}

        {data && data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.map((item: ContentItem) => (
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
                          priority={currentPage === 1}
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
                    {item.originalTitle && item.originalTitle !== item.title && (
                      <p className="text-gray-600 text-sm line-clamp-1">{item.originalTitle}</p>
                    )}
                    <div className="mt-2 text-sm">
                      {item.voteAverage !== undefined && (
                        <span>⭐ {item.voteAverage.toFixed(1)} • </span>
                      )}
                      {item.releaseDate && (
                        <span>{new Date(item.releaseDate).getFullYear()} • </span>
                      )}
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
            <Pagination
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              baseUrl={contentType ? `/?type=${contentType}` : "/"}
            />
          </>
        ) : (
          <p className="text-center text-gray-500">No content found</p>
        )}
      </main>
    </FavoritesProvider>
  );
}
