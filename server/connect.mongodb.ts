import mongoose from "mongoose";
import "./models/user.model";
import "./models/project.model";

export async function connectToMongoDB(url: string) {
  const connection = await mongoose.connect(url, {
    dbName: "Archer",
  });
  return connection;
}
