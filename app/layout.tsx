// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recci",
  description: "Browse and get recommended your next favorite Movie & TV Series",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Nav />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
