'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Connection,
  type Viewport,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';

import ServiceNode2 from './nodes/ServiceNode2';
import BackendNode from '@/components/Architecture/nodes/BackendNode';
import DatabaseNode from '@/components/Architecture/nodes/DatabaseNode';
import QueueNode from '@/components/Architecture/nodes/QueueNode';
import ServiceNode from '@/components/Architecture/nodes/ServiceNode';
import FrontendNew from '@/components/Architecture/nodes/FrontendNew';
import ServiceNodeContainer from './nodes/ServiceNodeContainer';

import ArchitectureEdge, {
  type ArchitectureEdgeData,
  type ArchitectureEdgeType,
} from '@/components/Architecture/edges/CustomEdge';

import '@xyflow/react/dist/style.css';

import MiniMapCustom from '@/components/Architecture/canvas/MiniMapCustom';
import CanvasControls from './canvas/CanvasControls';
import Loader from '@/components/Loader';

import { architectureUtils } from '@/utils/Architecture';
import EdgeEditor from './edges/EdgeEditor';
import CustomEdge from '@/components/Architecture/edges/CustomEdge';

import type {
  ArchitectureNodeType,
  ArchitectureEdgeType as SystemArchitectureEdgeType,
  ArchitectureEdgeDirection,
} from '@/types/Architecture';

type ArchitectureNodeData = {
  label: string;
  description: string;
  technology: string;
  color?: string;
};

type ArchitectureNode = Node<ArchitectureNodeData>;

const nodeTypes: Record<ArchitectureNodeType, React.ComponentType<any>> = {
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

const edgeTypes = {
  architecture: CustomEdge,
};

const mapBackendNode = (node: any): ArchitectureNode => {
  const rawType = String(node.type || '').toLowerCase() as ArchitectureNodeType;
  const nodeType = nodeTypes[rawType] ? rawType : 'service';
  
  return {
    id: String(node.id),
    type: nodeType,
    position: {
      x: Number(node.position?.x) || 0,
      y: Number(node.position?.y) || 0,
    },
    data: {
      label: String(node.data?.label || 'Component'),
      description: String(node.data?.description || ''),
      technology: String(
        node.data?.technology ||
          (Array.isArray(node.data?.technologies) ? node.data.technologies.join(', ') : '')
      ),
      color: node.data?.color || undefined,
    },
  };
};

const mapBackendEdge = (edge: any): ArchitectureEdgeType => {
  const rawType = (edge.type || 'http') as SystemArchitectureEdgeType;
  const protocol = edge.data?.protocol || '';
  const label = edge.label || edge.data?.label || '';
  const rawDirection = edge.data?.direction as ArchitectureEdgeDirection | string | undefined;

  const edgeData = {
    protocol: edge.data?.protocol || protocol || String(rawType),
    method: edge.data?.method || '',
    dataType: edge.data?.dataType || '',
    description: edge.data?.description || '',
    direction: rawDirection || 'request',
  };

  let color = edge.data?.color;
  if (!color || color === '#3b82f6') {
    const combined = `${rawType} ${protocol} ${label}`.toLowerCase();
    if (combined.includes('auth') || combined.includes('jwt') || combined.includes('login')) color = '#ef4444';
    else if (combined.includes('database') || combined.includes('sql') || combined.includes('query') || combined.includes('crud')) color = '#f59e0b';
    else if (combined.includes('cache') || combined.includes('redis') || combined.includes('memcached')) color = '#ec4899';
    else if (combined.includes('queue') || combined.includes('event') || combined.includes('pubsub') || combined.includes('mq')) color = '#8b5cf6';
    else if (combined.includes('websocket') || combined.includes('wss') || combined.includes('socket')) color = '#10b981';
    else if (combined.includes('ai') || combined.includes('llm') || combined.includes('external') || combined.includes('github') || combined.includes('openai')) color = '#06b6d4';
    else color = '#3b82f6';
  }

  const directionMapping: 'uni' | 'bi' | 'none' = 
    rawDirection === 'bidirectional' ? 'bi' :
    rawDirection === 'response' ? 'uni' : 'uni';

  return {
    id: String(edge.id || `${edge.source}-${edge.target}`),
    source: String(edge.source),
    target: String(edge.target),
    type: 'architecture',
    data: {
      label: String(label || protocol || 'Data Flow'),
      color: color,
      direction: directionMapping,
      dataFlow: edge.animated !== false,
      edgeData: edgeData,
    },
  };
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    getCookie('token') ||
    getCookie('auth_token') ||
    getCookie('jwt') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token')
  );
};


type ArchitectureCanvasProps = {
  projectId?: string;
};

function ArchitectureCanvas({
  projectId: propProjectId,
}: ArchitectureCanvasProps = {}) {
  const params = useParams();

  const rawId = params?.id;

  const routeProjectId = Array.isArray(rawId)
    ? rawId[0]
    : rawId;

  const projectId =
    propProjectId ||
    routeProjectId ||
    undefined;

  const [nodes, setNodes, onNodesChange] =
    useNodesState<ArchitectureNode>([]);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<ArchitectureEdgeType>([]);

  const [defaultViewport, setDefaultViewport] =
    useState<Viewport | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>('Loading system architecture...');
  const [errorText, setErrorText] = useState<string | null>(null);

  const [architectureId, setArchitectureId] =
    useState<string | null>(null);

  const [selectedEdge, setSelectedEdge] =
    useState<ArchitectureEdgeType | null>(null);

  const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  const updateNodePositionOnServer = useCallback(
    async (nodeId: string, position: { x: number; y: number }) => {
      if (!architectureId) return;
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      const token = getToken();

      try {
        await fetch(
          `${backendUrl}/architecture/${architectureId}/nodes/${nodeId}/position`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              x: Math.round(position.x),
              y: Math.round(position.y),
            }),
          }
        );
      } catch (err) {
        console.error('Failed to update node position on server:', err);
      }
    },
    [architectureId]
  );

  const debouncedUpdatePosition = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      const timers = debounceTimersRef.current;
      if (timers.has(nodeId)) {
        clearTimeout(timers.get(nodeId)!);
      }

      const timer = setTimeout(() => {
        timers.delete(nodeId);
        updateNodePositionOnServer(nodeId, position);
      }, 1000);

      timers.set(nodeId, timer);
    },
    [updateNodePositionOnServer]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<ArchitectureNode>[]) => {
      onNodesChange(changes);

      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          debouncedUpdatePosition(change.id, change.position);
        }
      });
    },
    [onNodesChange, debouncedUpdatePosition]
  );

  useEffect(() => {
    let isMounted = true;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

    const savedPosition = architectureUtils.getUserPosition(projectId);
    if (savedPosition) {
      setDefaultViewport(savedPosition);
    }

    // if (!projectId) {
    //   setNodes(initialNodes);
    //   setEdges(initialEdges);
    //   setLoading(false);
    //   return;
    // }

    const fetchOrGenerateArchitecture = async () => {
      try {
        setLoading(true);
        setErrorText(null);
        setLoadingText('Loading system architecture...');

        const token = getToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // 1. Try fetching existing architecture
        const res = await fetch(`${backendUrl}/architecture/project/${projectId}`, {
          method: 'GET',
          headers,
        });

        const data = await res.json().catch(() => ({}));

        if ((res.ok || res.status === 409) && data.architecture) {
          if (isMounted) {
            if (data.architecture._id || data.architecture.id) {
              setArchitectureId(String(data.architecture._id || data.architecture.id));
            }

            const fetchedNodes = Array.isArray(data.architecture.nodes)
              ? data.architecture.nodes.map(mapBackendNode)
              : [];
            const fetchedEdges = Array.isArray(data.architecture.edges)
              ? data.architecture.edges.map(mapBackendEdge)
              : [];

            setNodes(fetchedNodes.length > 0 ? fetchedNodes : {});
            setEdges(fetchedEdges.length > 0 ? fetchedEdges : {});

            if (!savedPosition && data.architecture.viewport) {
              setDefaultViewport(data.architecture.viewport);
            }

            setLoading(false);
          }
          return;
        }

        // 2. If architecture does not exist (404), trigger AI generation
        if (res.status === 404 || res.status === 400 || !res.ok) {
          if (isMounted) {
            setLoadingText('Generating AI System Architecture... This may take a moment.');
          }

          const genRes = await fetch(`${backendUrl}/architecture/ai`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ projectId }),
          });

          const genData = await genRes.json().catch(() => ({}));

          if (isMounted) {
            const arch = genData.architecture;
            if ((genRes.ok || genRes.status === 409) && arch) {
              if (arch._id || arch.id) {
                setArchitectureId(String(arch._id || arch.id));
              }

              const genNodes = Array.isArray(arch.nodes)
                ? arch.nodes.map(mapBackendNode)
                : [];
              const genEdges = Array.isArray(arch.edges)
                ? arch.edges.map(mapBackendEdge)
                : [];

              setNodes(genNodes.length > 0 ? genNodes : {});
              setEdges(genEdges.length > 0 ? genEdges : {});
              setLoading(false);
              return;
            } else {
              setErrorText(genData.message || 'Failed to generate architecture with AI.');
              setLoading(false);
              return;
            }
          }
        }
      } catch (err: any) {
        console.error('Architecture fetch/generate error:', err);
        if (isMounted) {
          setErrorText(err.message || 'Error loading architecture');
          setLoading(false);
        }
      }
    };

    fetchOrGenerateArchitecture();

    return () => {
      isMounted = false;
    };
  }, [projectId, setNodes, setEdges]);

  const onMoveEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent | null,
      viewport: Viewport
    ) => {
      architectureUtils.updateUserPosition(
        viewport,
        projectId
      );
    },
    [projectId]
  );

  const handleDeleteEdge = useCallback(
    async (edgeId: string) => {
      setEdges((currentEdges) => currentEdges.filter((e) => e.id !== edgeId));
      setSelectedEdge((currentSelected) =>
        currentSelected?.id === edgeId ? null : currentSelected
      );

      if (!architectureId) return;

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      const token = getToken();

      try {
        await fetch(
          `${backendUrl}/architecture/${architectureId}/edges/${edgeId}`,
          {
            method: 'DELETE',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
      } catch (err) {
        console.error('Failed to delete edge on server:', err);
      }
    },
    [architectureId, setEdges]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<ArchitectureEdgeType>[]) => {
      onEdgesChange(changes);

      changes.forEach((change) => {
        if (change.type === 'remove') {
          handleDeleteEdge(change.id);
        }
      });
    },
    [onEdgesChange, handleDeleteEdge]
  );

  const handleUpdateEdge = useCallback(
    async (updatedEdge: ArchitectureEdgeType) => {
      setEdges((currentEdges) =>
        currentEdges.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
      );
      setSelectedEdge(updatedEdge);

      if (!architectureId) return;

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      const token = getToken();

      const edgeData = updatedEdge.data || {};
      const nested = edgeData.edgeData || {};

      const payload = {
        label: edgeData.label || 'Data Flow',
        animated: edgeData.dataFlow !== false,
        data: {
          protocol: nested.protocol || 'http',
          method: nested.method || '',
          dataType: nested.dataType || 'JSON',
          description: nested.description || edgeData.label || '',
          direction: edgeData.direction === 'bi' ? 'bidirectional' : 'request',
          color: edgeData.color || '#3b82f6',
        },
      };

      try {
        await fetch(
          `${backendUrl}/architecture/${architectureId}/edges/${updatedEdge.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          }
        );
      } catch (err) {
        console.error('Failed to update edge on server:', err);
      }
    },
    [architectureId, setEdges]
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      const newEdge: ArchitectureEdgeType = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: 'architecture',
        data: {
          label: 'Data Flow',
          color: '#3b82f6',
          direction: 'uni',
          dataFlow: true,
          edgeData: {
            protocol: 'http',
            method: 'GET',
            dataType: 'JSON',
            description: '',
            direction: 'request',
          },
        },
      };

      setEdges((currentEdges) => addEdge(newEdge, currentEdges));

      if (!architectureId) return;

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      const token = getToken();

      const payload = {
        id: newEdge.id,
        source: newEdge.source,
        target: newEdge.target,
        sourceHandle: newEdge.sourceHandle || undefined,
        targetHandle: newEdge.targetHandle || undefined,
        type: 'http',
        label: 'Data Flow',
        animated: true,
        data: {
          protocol: 'http',
          method: 'GET',
          dataType: 'JSON',
          description: '',
          direction: 'request',
          color: '#3b82f6',
        },
      };

      try {
        await fetch(`${backendUrl}/architecture/${architectureId}/edges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Failed to create edge on server:', err);
      }
    },
    [architectureId, setEdges]
  );

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 min-h-100">
        <Loader />
        <p className="mt-4 animate-pulse text-sm text-zinc-400 font-medium">{loadingText}</p>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="flex min-h-100 h-full w-full items-center justify-center bg-white p-6 text-center dark:bg-zinc-950">
  <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
      Architecture generation failed
    </h3>

    <p className="mt-2 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
      {errorText}
    </p>

    <button
      onClick={() => window.location.reload()}
      className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
    >
      Retry
    </button>
  </div>
</div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onMoveEnd={onMoveEnd}
        onEdgeClick={(_event, edge) =>
          setSelectedEdge(edge as ArchitectureEdgeType)
        }
        onPaneClick={() => setSelectedEdge(null)}
        onNodeClick={() => setSelectedEdge(null)}
        defaultViewport={defaultViewport}
        fitView={!defaultViewport}
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Background
          gap={16}
          size={1}
        />

        <CanvasControls />
        {selectedEdge && (
          <Panel position="top-right">
            <EdgeEditor
              edge={selectedEdge}
              onUpdate={handleUpdateEdge}
              onDelete={handleDeleteEdge}
              onClose={() => setSelectedEdge(null)}
            />
          </Panel>
        )}
        <Panel position="bottom-right">
          <MiniMapCustom />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default ArchitectureCanvas;
