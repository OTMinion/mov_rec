// components/Nav.tsx
"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Nav() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/emotions" className="text-gray-600 hover:text-gray-900">
          Browse by Emotion
        </Link>
        <Link href="/" className="text-xl font-bold">
          Recci
        </Link>
        {isSignedIn && (
          <Link href="/favorites" className="text-gray-600 hover:text-gray-900">
            My Favorites
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoaded && (
          <>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-gray-900">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
