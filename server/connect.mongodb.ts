import mongoose from "mongoose";

export async function connectToMongoDB(url: string) {
  const connection = await mongoose.connect(url, {
    dbName: "Archer",
  });

  console.log("MongoDB connected successfully");

  return connection;
}
