import { useCallback } from 'react';

import {
  ReactFlow,
  MiniMap,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';

import FrontendNode from '@/components/Architecture/nodes/FrontendNode';
import BackendNode from '@/components/Architecture/nodes/BackendNode';
import DatabaseNode from '@/components/Architecture/nodes/DatabaseNode';
import QueueNode from '@/components/Architecture/nodes/QueueNode';
import ServiceNode from '@/components/Architecture/nodes/ServiceNode';

import '@xyflow/react/dist/style.css';
import MiniMapCustom from '@/components/Architecture/canvas/MiniMapCustom';
import CanvasControls from './canvas/CanvasControls';

type ArchitectureNodeData = {
  label: string;
  description: string;
  technology: string;
  color?:string,
};

type ArchitectureNode = Node<ArchitectureNodeData>;

const nodeTypes = {
  frontend: FrontendNode,
  backend: BackendNode,
  database: DatabaseNode,
  queue: QueueNode,
  service: ServiceNode,
};

const initialNodes: ArchitectureNode[] = [
  {
    id: 'frontend',
    type: 'frontend',
    position: {
      x: 100,
      y: 250,
    },
    data: {
      label: 'Frontend',
      description: 'User interface',
      technology: 'React + Tailwind',
    },
  },

  {
    id: 'backend',
    type: 'backend',
    position: {
      x: 450,
      y: 250,
    },
    data: {
      label: 'Backend API',
      description: 'Business logic and APIs',
      technology: 'Node.js + Express',
    },
  },

  {
    id: 'database',
    type: 'database',
    position: {
      x: 800,
      y: 250,
    },
    data: {
      label: 'Database',
      description: 'Application data',
      technology: 'MongoDB',
      // color:'#12544F',
    },
  },

  {
    id: 'github',
    type: 'service',
    position: {
      x: 800,
      y: 500,
    },
    data: {
      label: 'GitHub API',
      description: 'Repository information',
      technology: 'GitHub REST API',
    },
  },

  {
    id: 'queue',
    type: 'queue',
    position: {
      x: 450,
      y: 500,
    },
    data: {
      label: 'Message Queue',
      description: 'Asynchronous communication',
      technology: 'Redis',
    },
  },

  {
    id: 'auth',
    type: 'service',
    position: {
      x: 450,
      y: 50,
    },
    data: {
      label: 'Auth Service',
      description: 'Authentication and authorization',
      technology: 'JWT',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'frontend-backend',
    source: 'frontend',
    target: 'backend',
    label: 'API Request',
    animated: true,
  },

  {
    id: 'backend-database',
    source: 'backend',
    target: 'database',
    label: 'CRUD',
    animated: true,
  },

  {
    id: 'backend-github',
    source: 'backend',
    target: 'github',
    label: 'REST API',
  },

  {
    id: 'backend-queue',
    source: 'backend',
    target: 'queue',
    label: 'Events',
    animated: true,
  },

  {
    id: 'frontend-auth',
    source: 'frontend',
    target: 'auth',
    label: 'Login',
  },

  {
    id: 'auth-backend',
    source: 'auth',
    target: 'backend',
    label: 'JWT',
  },
];

function ArchitectureCanvas() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<ArchitectureNode>(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...params,
            animated: true,
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Background
          gap={16}
          size={1}
        />

        <CanvasControls/>

        <Panel position="bottom-right">
          <MiniMapCustom />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default ArchitectureCanvas;