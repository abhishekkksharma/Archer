import express, { type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";
import projectsRouter from "./routes/project.route";
import roadmapRouter from "./routes/roadmap.route";
import tasksRouter from "./routes/tasks.route";
import progressRouter from "./routes/progress.routes";
import architectureRoutes from "./routes/architecture.routes";
import assistantRouter from "./routes/assistant.route";
import userRouter from "./routes/user.routes"
import publishedProjectRouter from "./routes/publishedProjects.routes"

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/project", projectsRouter);
app.use("/api/roadmaps", roadmapRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/architecture", architectureRoutes);
app.use("/api/assistant", assistantRouter);
app.use("/api/chat", assistantRouter);
app.use("/api/user",userRouter);
app.use("/api/published",publishedProjectRouter)

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Server is running!",
  });
});

export default app;