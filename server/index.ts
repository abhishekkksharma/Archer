import "dotenv/config";
import app from "./app";
import { connectToMongoDB } from "./connect.mongodb";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await connectToMongoDB(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
