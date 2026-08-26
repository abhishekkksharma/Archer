import "dotenv/config"; 
import app from "./app"; 
import { connectToMongoDB } from "./connect.mongodb";

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI: string = process.env.MONGODB_URI as string;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToMongoDB(MONGODB_URI).then(() => {
  console.log("MongoDB connected!");
});

export {};