# System Architecture

Archer is built on a resilient, modern fullstack architecture composed of a Next.js 16 frontend, an Express.js Node.js API backend, MongoDB for persistent document storage, and OpenRouter for LLM completions.

## High-Level Architecture

```
User Browser
    │
    ▼
Next.js 16 Client App (React 19 + Tailwind CSS v4)
    │
    ▼ REST APIs (JWT Bearer Token)
Express.js Server (Node.js + TypeScript)
    │
    ├──► MongoDB (Mongoose ODM)
    │
    └──► OpenRouter AI Completion API (JSON Validation & Defensive Repair)
```

## Architectural Highlights

- **Separation of Concerns**: Clean boundaries between presentation, business logic, persistence, and external AI services.
- **Defensive LLM Handling**: Built-in JSON repair algorithms ensure that truncated or slightly malformed model outputs are reliably healed.
- **Type Safety**: End-to-end TypeScript interfaces ensure data integrity across client components and backend controllers.

## In this Section

- **[Overview](/docs#architecture/overview)**: Architectural design principles and system boundaries.
- **[Frontend](/docs#architecture/frontend)**: Next.js App Router, React 19 hooks, and styling system.
- **[Backend](/docs#architecture/backend)**: Express API routes, middlewares, services, and MongoDB schemas.
