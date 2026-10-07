import {
    Node
} from '@xyflow/react';
import type {
    ArchitectureNodeType,
    ArchitectureEdgeType as SystemArchitectureEdgeType,
    ArchitectureEdgeDirection,
} from '@/types/Architecture';

import ServiceNode2 from '../components/Architecture/nodes/ServiceNode2';
import BackendNode from '@/components/Architecture/nodes/BackendNode';
import DatabaseNode from '@/components/Architecture/nodes/DatabaseNode';
import QueueNode from '@/components/Architecture/nodes/QueueNode';
import ServiceNode from '@/components/Architecture/nodes/ServiceNode';
import FrontendNew from '@/components/Architecture/nodes/FrontendNew';
import ServiceNodeContainer from '@/components/Architecture/nodes/ServiceNodeContainer';
import CustomEdge from '@/components/Architecture/edges/CustomEdge';

export type ArchitectureNodeData = {
    label: string;
    description: string;
    technology: string;
    color?: string;
};

export type ArchitectureNode = Node<ArchitectureNodeData>;

export const nodeTypes: Record<ArchitectureNodeType, React.ComponentType<any>> = {
    // Application
    frontend: FrontendNew,
    backend: BackendNode,
    api: BackendNode,
    service: ServiceNode2,
    microservice: ServiceNode2,
    worker: ServiceNode2,

    // Data
    database: DatabaseNode,
    'sql-database': DatabaseNode,
    'nosql-database': DatabaseNode,
    cache: DatabaseNode,
    search: DatabaseNode,
    'object-storage': DatabaseNode,
    'file-storage': DatabaseNode,

    // Messaging
    queue: QueueNode,
    'message-broker': QueueNode,
    'event-bus': QueueNode,
    pubsub: QueueNode,

    // Infrastructure
    'load-balancer': ServiceNode2,
    'api-gateway': ServiceNode2,
    'reverse-proxy': ServiceNode2,
    cdn: ServiceNode2,
    dns: ServiceNode2,
    server: ServiceNode2,
    container: ServiceNodeContainer,
    serverless: ServiceNode2,

    // Security
    auth: ServiceNode2,
    'identity-provider': ServiceNode2,
    firewall: ServiceNode2,
    'secret-manager': ServiceNode2,

    // External Services
    'external-service': ServiceNode2,
    'external-api': ServiceNode2,
    payment: ServiceNode2,
    email: ServiceNode2,
    notification: ServiceNode2,
    github: ServiceNode2,
    analytics: ServiceNode2,

    // AI / ML
    'ai-service': ServiceNode2,
    'ml-model': ServiceNode2,
    'vector-database': DatabaseNode,
    'embedding-service': ServiceNode2,

    // Architecture Groups
    'container-group': ServiceNodeContainer,
    'service-group': ServiceNodeContainer,

    // Generic
    custom: ServiceNode2,
};

export const edgeTypes = {
  architecture: CustomEdge,
};