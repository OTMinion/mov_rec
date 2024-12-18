// components/FavoriteButton.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/favoriteActions";
import { SignInButton } from "@clerk/nextjs";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  showId: string;
}

export default function FavoriteButton({ showId }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { favorites, setFavorite, initialized } = useFavorites();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      return;
    }

    setLoading(true);
    const result = await toggleFavorite(showId);
    if (result.success && typeof result.isFavorited === "boolean") {
      setFavorite(showId, result.isFavorited);
    }
    setLoading(false);
  };

  if (!isLoaded || !initialized) {
    return (
      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" disabled>
        <Heart className="h-5 w-5 text-gray-400" />
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Heart className="h-5 w-5 text-gray-400" />
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        favorites[showId] ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      <Heart
        className={`h-5 w-5 ${favorites[showId] ? "text-red-500 fill-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}
