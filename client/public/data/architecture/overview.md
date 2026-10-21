# Architecture Overview

The Archer system is engineered for scalability, responsiveness, and resilience when integrating generative AI into project planning workflows.

## Design Goals

1. **Deterministic Structured Output**: Large Language Models can be non-deterministic. Archer enforces rigorous JSON schema validation and defensive repair algorithms so that generated blueprints never break the client application.
2. **Context-Rich AI Interactions**: The AI Assistant receives the active project's tech stack, current roadmap phases, and architectural requirements as system context, preventing generic or irrelevant guidance.
3. **Responsive Visual Feedback**: From interactive diagrams powered by XYFlow/React Flow to physics-based canvas effects, Archer provides an engaging visual workspace for developers.
4. **Modularity**: Every project component (Tasks, Tech Stack, Roadmap, Notes, Analysis) operates as an independent module that can be incrementally updated.

## Communication Protocols

- **Client-to-Server**: RESTful HTTP endpoints with JSON request/response payloads.
- **Authentication**: Stateless JSON Web Tokens (JWT) transmitted via `Authorization: Bearer <token>` headers or secure HTTP-only cookies.
- **External AI**: Secure outbound HTTPS calls to OpenRouter API endpoints with token-limited prompts and structured format schemas.
