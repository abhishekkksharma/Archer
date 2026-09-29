'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { nodeEditorutils, ArchitectureNodePayload } from '@/utils/Archiecture.node';
import type { ArchitectureNodeType } from '@/types/Architecture';

export interface NodeEditorProps {
  node?: any;
  data?: any;
  architectureId?: string;
  onUpdate?: (updatedNode: any) => void;
  onDelete?: (nodeId: string) => void;
  onClose?: () => void;
}

const COLOR_PRESETS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#64748b', // Slate
];

const NODE_TYPE_OPTIONS: { label: string; value: ArchitectureNodeType }[] = [
  { label: 'Service', value: 'service' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'API Gateway', value: 'api-gateway' },
  { label: 'Microservice', value: 'microservice' },
  { label: 'Worker', value: 'worker' },
  { label: 'Database', value: 'database' },
  { label: 'SQL Database', value: 'sql-database' },
  { label: 'NoSQL Database', value: 'nosql-database' },
  { label: 'Cache', value: 'cache' },
  { label: 'Message Queue', value: 'queue' },
  { label: 'Load Balancer', value: 'load-balancer' },
  { label: 'Auth / Security', value: 'auth' },
  { label: 'AI Service', value: 'ai-service' },
  { label: 'Container', value: 'container' },
  { label: 'Custom', value: 'custom' },
];

function NodeEditor({
  node: propNode,
  data: propData,
  architectureId,
  onUpdate,
  onDelete,
  onClose,
}: NodeEditorProps) {
  const currentNode = propNode || propData;

  const nodeData = currentNode?.data || {};
  const [label, setLabel] = useState(nodeData.label || '');
  const [description, setDescription] = useState(nodeData.description || '');
  const [technology, setTechnology] = useState(nodeData.technology || '');
  const [type, setType] = useState<string>(currentNode?.type || 'service');
  const [color, setColor] = useState<string>(nodeData.color || '#3b82f6');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = propNode || propData;
    if (target) {
      const d = target.data || {};
      setLabel(d.label || '');
      setDescription(d.description || '');
      setTechnology(d.technology || (Array.isArray(d.technologies) ? d.technologies.join(', ') : ''));
      setType(target.type || 'service');
      setColor(d.color || '#3b82f6');
    }
  }, [propNode, propData]);

  if (!currentNode) {
    return null;
  }

  const handleFieldChange = (updates: {
    label?: string;
    description?: string;
    technology?: string;
    type?: string;
    color?: string;
  }) => {
    const newLabel = updates.label !== undefined ? updates.label : label;
    const newDescription = updates.description !== undefined ? updates.description : description;
    const newTech = updates.technology !== undefined ? updates.technology : technology;
    const newType = updates.type !== undefined ? updates.type : type;
    const newColor = updates.color !== undefined ? updates.color : color;

    const updatedNode = {
      ...currentNode,
      type: newType,
      data: {
        category: currentNode.data?.category || newLabel || newType || 'Service',
        ...currentNode.data,
        label: newLabel,
        description: newDescription,
        technology: newTech,
        technologies: newTech ? newTech.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        color: newColor,
      },
    };

    if (onUpdate) {
      onUpdate(updatedNode);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const nodeId = currentNode.id;
      const updates: ArchitectureNodePayload = {
        type: type,
        data: {
          category: currentNode.data?.category || label || type || 'Service',
          label,
          description,
          technology,
          technologies: technology ? technology.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          color,
        },
      };

      if (architectureId && nodeId) {
        await nodeEditorutils.updateNode(architectureId, nodeId, updates);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save node updates:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const nodeId = currentNode.id;
      if (architectureId && nodeId) {
        await nodeEditorutils.deleteNode(architectureId, nodeId);
      }
      if (onDelete && nodeId) {
        onDelete(nodeId);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to delete node:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-80 rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b pb-2 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Edit Component Node
          </h4>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 text-xs">
        {/* Component Label */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Node Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              handleFieldChange({ label: e.target.value });
            }}
            placeholder="e.g. Auth Service"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Node Type Selector */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Node Type
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              handleFieldChange({ type: e.target.value });
            }}
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-900 outline-none transition-all focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500"
          >
            {NODE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </option>
            ))}
          </select>
        </div>

        {/* Technology / Stack */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Technology / Stack
          </label>
          <input
            type="text"
            value={technology}
            onChange={(e) => {
              setTechnology(e.target.value);
              handleFieldChange({ technology: e.target.value });
            }}
            placeholder="e.g. Node.js, PostgreSQL, Redis"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              handleFieldChange({ description: e.target.value });
            }}
            placeholder="Brief description of component role..."
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Color Presets & Picker */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Accent Color
          </label>
          <div className="flex items-center gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  handleFieldChange({ color: c });
                }}
                className={`h-5 w-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
                  color === c ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-zinc-900' : ''
                }`}
                style={{ backgroundColor: c }}
              >
                {color === c && <Check className="h-3 w-3 text-white" />}
              </button>
            ))}

            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                handleFieldChange({ color: e.target.value });
              }}
              className="ml-auto h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              title="Custom Color"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between border-t pt-3 dark:border-zinc-800">
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{isDeleting ? 'Deleting...' : 'Delete Node'}</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="rounded-md border border-zinc-200 bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSaving ? 'Saving...' : 'Done'}
        </button>
      </div>
    </div>
  );
}

export default NodeEditor;