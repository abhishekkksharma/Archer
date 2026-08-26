import mongoose, { Schema, type HydratedDocument, type Types } from "mongoose";

export interface UserI {
  name: string;
  email: string;
  password: string;
  googleId?: string | null;
  avatar: "avatar1" | "avatar2" | "avatar3" | "avatar4" | "avatar5";
  projects: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<UserI>;

const userSchema = new Schema<UserI>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      enum: ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"],
      default: "avatar1",
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserI>("User", userSchema);

export default User;
