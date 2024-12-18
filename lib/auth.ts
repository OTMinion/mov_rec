// lib/auth.ts
import { currentUser } from "@clerk/nextjs/server";
import UserModel from "@/models/userModel";
import connectDB from "@/config/database";

export async function ensureDbUser() {
  try {
    const user = await currentUser();
    if (!user) return null;

    await connectDB();

    let dbUser = await UserModel.findOne({ clerkId: user.id });

    if (!dbUser) {
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );

      dbUser = await UserModel.create({
        clerkId: user.id,
        email: primaryEmail?.emailAddress || "",
        favorites: [],
      });
    }

    return dbUser;
  } catch (error) {
    console.error("Error in ensureDbUser:", error);
    return null;
  }
}
