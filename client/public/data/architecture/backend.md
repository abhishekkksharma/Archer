# Backend Architecture

Archer's backend is a Node.js REST API built with Express.js and TypeScript, connected to MongoDB using Mongoose.

## Architecture Layers

1. **Routing Layer (`/server/routes`)**:
   - `authRoutes`: User registration, email/password login, Google OAuth callbacks, and `/me` verification.
   - `projectRoutes`: CRUD operations for user projects, metadata updates, and deletion cascades.
   - `roadmapRoutes`: AI roadmap generation, phase updates, and task status synchronization.
   - `taskRoutes`: Task manipulation, priority updates, and phase re-ordering.
2. **Controller Layer (`/server/controllers`)**:
   - Implements request validation, error handling, and orchestrates services.
3. **Service Layer (`/server/services`)**:
   - `openRouterService`: Interfaces with OpenRouter LLMs, manages token limits, and repairs JSON truncation.
   - `techStackService`: Analyzes technology compatibility and validates tech additions.
4. **Data Persistence (`/server/models`)**:
   - Mongoose schemas with indexed user references for high-speed queries and data isolation.

## Security & Reliability

- **Stateless Authentication**: JWT tokens with configurable expiration and secret rotation.
- **CORS Filtering**: Strict origin validation against the configured `CLIENT_URL`.
- **Defensive Error Handling**: Centralized error middleware ensuring safe error messages without leaking stack traces in production.
