export type ArchitectureNodeType =
  // Application
  | "frontend"
  | "backend"
  | "api"
  | "service"
  | "microservice"
  | "worker"

  // Data
  | "database"
  | "sql-database"
  | "nosql-database"
  | "cache"
  | "search"
  | "object-storage"
  | "file-storage"

  // Messaging
  | "queue"
  | "message-broker"
  | "event-bus"
  | "pubsub"

  // Infrastructure
  | "load-balancer"
  | "api-gateway"
  | "reverse-proxy"
  | "cdn"
  | "dns"
  | "server"
  | "container"
  | "serverless"

  // Security
  | "auth"
  | "identity-provider"
  | "firewall"
  | "secret-manager"

  // External Services
  | "external-service"
  | "external-api"
  | "payment"
  | "email"
  | "notification"
  | "github"
  | "analytics"

  // AI / ML
  | "ai-service"
  | "ml-model"
  | "vector-database"
  | "embedding-service"

  // Architecture Groups
  | "container-group"
  | "service-group"

  // Generic
  | "custom";


export type ArchitectureEdgeType =
  // Network
  | "http"
  | "https"
  | "grpc"
  | "websocket"

  // Data
  | "data-flow"
  | "database-query"

  // Messaging
  | "event"
  | "message-queue"
  | "pubsub"

  // Architecture
  | "dependency"
  | "sync"
  | "async"

  // Generic
  | "custom";


export type ArchitectureEdgeDirection =
  | "request"
  | "response"
  | "bidirectional";