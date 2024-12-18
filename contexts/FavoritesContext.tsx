// contexts/FavoritesContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { batchCheckFavorites } from "@/actions/favoriteActions";

type FavoritesContextType = {
  favorites: Record<string, boolean>;
  setFavorite: (showId: string, isFavorite: boolean) => void;
  initialized: boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: {},
  setFavorite: () => {},
  initialized: false,
});

export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({
  children,
  initialShowIds,
}: {
  children: React.ReactNode;
  initialShowIds: string[];
}) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    async function initializeFavorites() {
      if (isSignedIn && initialShowIds.length > 0) {
        const { favoriteMap, error } = await batchCheckFavorites(initialShowIds);
        if (!error && favoriteMap) {
          setFavorites(favoriteMap);
        }
      }
      setInitialized(true);
    }

    if (isLoaded) {
      initializeFavorites();
    }
  }, [isSignedIn, isLoaded, initialShowIds]);

  const setFavorite = (showId: string, isFavorite: boolean) => {
    setFavorites((prev) => ({ ...prev, [showId]: isFavorite }));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorite, initialized }}>
      {children}
    </FavoritesContext.Provider>
  );
}
