import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "system" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "system", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const chatSchema = new Schema<IChat>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({
  projectId: 1,
  userId: 1,
});

export const Chat = mongoose.model<IChat>("Chat", chatSchema);