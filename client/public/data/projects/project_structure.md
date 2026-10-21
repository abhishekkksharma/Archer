# Project Structure

Archer maintains a clean separation between client-side state, server logic, and persistent storage. Understanding this structure helps both users and contributors navigate the codebase.

## Repository Organization

```
Archer/
├── client/                     # Next.js 16 Frontend Application
│   ├── app/                    # App Router Pages & Layouts
│   │   ├── (auth)/             # Login & Register routes
│   │   ├── dashboard/          # Project list & overview
│   │   ├── docs/               # Documentation viewer
│   │   └── project/[id]/       # Dynamic Project Workspaces
│   │       ├── analysis/       # Architecture analysis
│   │       ├── architecture/   # Interactive diagrams
│   │       ├── assistant/      # AI Chat workspace
│   │       ├── overview/       # Summary & live viewport
│   │       ├── progress/       # Sprint analytics
│   │       ├── roadmap/        # Phased roadmap
│   │       ├── settings/       # Project config
│   │       ├── tasks/          # Todo & task board
│   │       └── tech-stack/     # Stack manager
│   ├── components/             # Reusable UI Components
│   ├── utils/                  # Client utilities & config
│   └── public/                 # Static assets & markdown docs
│
└── server/                     # Express.js Backend API Server
    ├── controllers/            # Route controllers
    ├── middlewares/            # JWT & auth middleware
    ├── models/                 # Mongoose schemas
    ├── prompts/                # AI system prompt templates
    ├── routes/                 # Express API routes
    └── services/               # OpenRouter AI & business logic
```

## Data Models

Projects are represented in MongoDB using Mongoose schemas:

- **Project Model**: Stores metadata (name, description, projectType, experienceLevel, progress, githubRepo, liveUrl).
- **Roadmap Model**: Stores execution phases, task details, dependencies, and estimations.
- **TechStack Model**: Categorizes technologies into Frontend, Backend, Database, Auth, and Other Services.
- **Chat Model**: Persists conversations between the user and the contextual AI assistant.
