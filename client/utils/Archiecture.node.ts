import { getCookie } from './cookie';
import type { ArchitectureNodeType } from '@/types/Architecture';

export type NodeData = {
  position?: {
    x: number;
    y: number;
  };
  label: string;
  description?: string;
  technology?: string;
  technologies?: string[];
  icon?: string;
  color?: string;
  [key: string]: any;
};

export type ArchitectureNodePayload = {
  id?: string;
  type?: ArchitectureNodeType | string;
  position?: {
    x: number;
    y: number;
  };
  data: NodeData;
  width?: number;
  height?: number;
  parentId?: string;
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  node?: T;
  position?: { x: number; y: number };
  version?: number;
}

const getBackendUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:5000/api'
  );
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

class NodeEditorUtils {
  /**
   * Creates a new node in the specified architecture on the backend.
   * @param architectureId The ID of the architecture diagram
   * @param node Payload containing node details (id, type, position, data)
   */
  public async createNode(
    architectureId: string | null | undefined,
    node: ArchitectureNodePayload
  ): Promise<ApiResponse> {
    if (!architectureId) {
      console.warn('createNode: No architectureId provided. Skipping server API sync.');
      return { success: true, node: node as any };
    }

    const backendUrl = getBackendUrl();
    const token = getToken();

    const payload = {
      id: node.id || `node-${Date.now()}`,
      type: node.type || 'service',
      position: node.position || { x: 100, y: 100 },
      data: {
        category: node.data.category || node.data.label || String(node.type || 'Service'),
        description: node.data.description || '',
        technology: node.data.technology || (Array.isArray(node.data.technologies) ? node.data.technologies.join(', ') : ''),
        technologies: node.data.technologies || (node.data.technology ? [node.data.technology] : []),
        icon: node.data.icon || '',
        color: node.data.color || undefined,
        ...node.data,
        label: node.data.label || 'New Component',
      },
      width: node.width,
      height: node.height,
      parentId: node.parentId,
    };

    try {
      const response = await fetch(
        `${backendUrl}/architecture/${architectureId}/nodes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Failed to create node (${response.status})`);
      }

      return data;
    } catch (error: any) {
      console.error('createNode error:', error);
      throw error;
    }
  }

  /**
   * Updates an existing node in the specified architecture.
   * @param architectureId The ID of the architecture diagram
   * @param nodeId The ID of the node to update
   * @param updates Partial updates for the node (type, position, data, etc.)
   */
  public async updateNode(
    architectureId: string | null | undefined,
    nodeId: string,
    updates: Partial<ArchitectureNodePayload>
  ): Promise<ApiResponse> {
    if (!architectureId) {
      console.warn('updateNode: No architectureId provided. Skipping server API sync.');
      return { success: true };
    }

    if (!nodeId) {
      throw new Error('Node ID is required to update a node');
    }

    const backendUrl = getBackendUrl();
    const token = getToken();

    const formattedUpdates = { ...updates };
    if (formattedUpdates.data) {
      formattedUpdates.data = {
        category: formattedUpdates.data.category || formattedUpdates.data.label || String(formattedUpdates.type || 'Service'),
        ...formattedUpdates.data,
      };
    }

    try {
      const response = await fetch(
        `${backendUrl}/architecture/${architectureId}/nodes/${nodeId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formattedUpdates),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Failed to update node (${response.status})`);
      }

      return data;
    } catch (error: any) {
      console.error('updateNode error:', error);
      throw error;
    }
  }

  /**
   * Updates position of a node in the specified architecture.
   * @param architectureId The ID of the architecture diagram
   * @param nodeId The ID of the node
   * @param position New x and y coordinates
   */
  public async updateNodePosition(
    architectureId: string | null | undefined,
    nodeId: string,
    position: { x: number; y: number }
  ): Promise<ApiResponse> {
    if (!architectureId) {
      console.warn('updateNodePosition: No architectureId provided. Skipping server API sync.');
      return { success: true, position };
    }

    if (!nodeId) {
      throw new Error('Node ID is required to update node position');
    }

    const backendUrl = getBackendUrl();
    const token = getToken();

    try {
      const response = await fetch(
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

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Failed to update node position (${response.status})`);
      }

      return data;
    } catch (error: any) {
      console.error('updateNodePosition error:', error);
      throw error;
    }
  }

  /**
   * Deletes a node from the specified architecture.
   * @param architectureId The ID of the architecture diagram
   * @param nodeId The ID of the node to delete
   */
  public async deleteNode(
    architectureId: string | null | undefined,
    nodeId: string
  ): Promise<ApiResponse> {
    if (!architectureId) {
      console.warn('deleteNode: No architectureId provided. Skipping server API sync.');
      return { success: true };
    }

    if (!nodeId) {
      throw new Error('Node ID is required to delete a node');
    }

    const backendUrl = getBackendUrl();
    const token = getToken();

    try {
      const response = await fetch(
        `${backendUrl}/architecture/${architectureId}/nodes/${nodeId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Failed to delete node (${response.status})`);
      }

      return data;
    } catch (error: any) {
      console.error('deleteNode error:', error);
      throw error;
    }
  }
}

export const nodeEditorutils = new NodeEditorUtils();
export const nodeEditorUtils = nodeEditorutils;
export { NodeEditorUtils };