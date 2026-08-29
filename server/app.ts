import express, { type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));

app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Server is running!",
  });
});

export default app;