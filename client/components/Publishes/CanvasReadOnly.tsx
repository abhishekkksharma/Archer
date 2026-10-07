'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getToken } from '@/utils/cookie';

import {
  ReactFlow,
  Background,
  Panel,
  Controls,
  type Viewport,
} from '@xyflow/react';
import { nodeTypes, edgeTypes, ArchitectureNode } from '@/types/NodeTypes';

import '@xyflow/react/dist/style.css';

import MiniMapCustom from '@/components/Architecture/canvas/MiniMapCustom';
import Loader from '@/components/Loader';

import type {
  ArchitectureNodeType,
  ArchitectureEdgeType as SystemArchitectureEdgeType,
  ArchitectureEdgeDirection,
} from '@/types/Architecture';
import type { ArchitectureEdgeType } from '@/components/Architecture/edges/CustomEdge';

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

type ReadonlyCanvasProps = {
  projectId?: string;
  className?: string;
};

export default function CanvasReadOnly({ projectId: propProjectId, className = '' }: ReadonlyCanvasProps) {
  const params = useParams();
  const rawId = params?.id;
  const routeProjectId = Array.isArray(rawId) ? rawId[0] : rawId;
  const projectId = propProjectId || routeProjectId || undefined;

  const [nodes, setNodes] = useState<ArchitectureNode[]>([]);
  const [edges, setEdges] = useState<ArchitectureEdgeType[]>([]);
  const [defaultViewport, setDefaultViewport] = useState<Viewport | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>('Loading system architecture...');
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

    const fetchOrGenerateArchitecture = async () => {
      try {
        setLoading(true);
        setErrorText(null);

        const token = getToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${backendUrl}/architecture/project/${projectId}`, {
          method: 'GET',
          headers,
        });

        const data = await res.json().catch(() => ({}));

        if ((res.ok || res.status === 409) && data.architecture) {
          if (isMounted) {
            const fetchedNodes = Array.isArray(data.architecture.nodes)
              ? data.architecture.nodes.map(mapBackendNode)
              : [];
            const fetchedEdges = Array.isArray(data.architecture.edges)
              ? data.architecture.edges.map(mapBackendEdge)
              : [];

            setNodes(fetchedNodes);
            setEdges(fetchedEdges);

            if (data.architecture.viewport) {
              setDefaultViewport(data.architecture.viewport);
            }

            setLoading(false);
          }
          return;
        }

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
              const genNodes = Array.isArray(arch.nodes) ? arch.nodes.map(mapBackendNode) : [];
              const genEdges = Array.isArray(arch.edges) ? arch.edges.map(mapBackendEdge) : [];

              setNodes(genNodes);
              setEdges(genEdges);
              setLoading(false);
            } else {
              setErrorText(genData.message || 'Failed to generate architecture with AI.');
              setLoading(false);
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

    if (projectId) {
      fetchOrGenerateArchitecture();
    }

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className={`flex h-full w-full min-h-[400px] flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 rounded-lg ${className}`}>
        <Loader />
        <p className="mt-4 animate-pulse text-sm text-zinc-400 font-medium">{loadingText}</p>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className={`flex h-full w-full min-h-[400px] items-center justify-center bg-white p-6 text-center dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 ${className}`}>
        <div className="max-w-sm">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Architecture view unavailable
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{errorText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-lg overflow-hidden bg-white dark:bg-zinc-950 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        fitView={true}
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true} 
        zoomOnScroll={true}
      >
        <Background gap={16} size={1} />
        <Controls position="bottom-left" showInteractive={false} showFitView={true} />

        <Panel position="bottom-right">
          <MiniMapCustom />
        </Panel>
      </ReactFlow>
    </div>
  );
}