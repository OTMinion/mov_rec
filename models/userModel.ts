// models/userModel.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  favorites: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
