export type ArchitectureNodeType =
  | "frontend"
  | "backend"
  | "api"
  | "database"
  | "cache"
  | "queue"
  | "storage"
  | "service"
  | "microservice"
  | "auth"
  | "load-balancer"
  | "cdn"
  | "worker"
  | "container"
  | "external-service"
  | "ai-service"
  | "custom";

export type ArchitectureEdgeType =
  | "data-flow"
  | "http"
  | "websocket"
  | "event"
  | "message-queue"
  | "database-query"
  | "dependency"
  | "async"
  | "custom";

export type ArchitectureEdgeDirection =
  | "request"
  | "response"
  | "bidirectional";