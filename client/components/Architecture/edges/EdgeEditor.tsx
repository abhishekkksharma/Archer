'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowRightLeft, Minus, Trash2, X, Check } from 'lucide-react';
import type { ArchitectureEdgeType } from './CustomEdge';

export interface EdgeEditorProps {
  edge: ArchitectureEdgeType;
  onUpdate: (updatedEdge: ArchitectureEdgeType) => void;
  onDelete: (edgeId: string) => void;
  onClose: () => void;
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

const PROTOCOL_OPTIONS = [
  'http',
  'https',
  'grpc',
  'websocket',
  'sql',
  'redis',
  'kafka',
  'amqp',
  'event',
  'custom',
];

const METHOD_OPTIONS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'QUERY',
  'PUBLISH',
  'SUBSCRIBE',
];

function EdgeEditor({ edge, onUpdate, onDelete, onClose }: EdgeEditorProps) {
  const edgeData = edge.data || {};
  const nestedEdgeData = edgeData.edgeData || {};

  const [label, setLabel] = useState(edgeData.label || '');
  const [description, setDescription] = useState(
    nestedEdgeData.description || edgeData.description || ''
  );
  const [color, setColor] = useState(edgeData.color || '#3b82f6');
  const [direction, setDirection] = useState<'none' | 'uni' | 'bi'>(
    edgeData.direction || 'uni'
  );
  const [dataFlow, setDataFlow] = useState<boolean>(
    edgeData.dataFlow !== false
  );
  const [protocol, setProtocol] = useState(nestedEdgeData.protocol || 'http');
  const [method, setMethod] = useState(nestedEdgeData.method || '');
  const [dataType, setDataType] = useState(nestedEdgeData.dataType || 'JSON');

  // Sync state if selected edge changes
  useEffect(() => {
    const currentData = edge.data || {};
    const currentNested = currentData.edgeData || {};
    setLabel(currentData.label || '');
    setDescription(currentNested.description || currentData.description || '');
    setColor(currentData.color || '#3b82f6');
    setDirection(currentData.direction || 'uni');
    setDataFlow(currentData.dataFlow !== false);
    setProtocol(currentNested.protocol || 'http');
    setMethod(currentNested.method || '');
    setDataType(currentNested.dataType || 'JSON');
  }, [edge]);

  const handleApplyChanges = (updates: Partial<{
    label: string;
    description: string;
    color: string;
    direction: 'none' | 'uni' | 'bi';
    dataFlow: boolean;
    protocol: string;
    method: string;
    dataType: string;
  }>) => {
    const newLabel = updates.label !== undefined ? updates.label : label;
    const newDescription = updates.description !== undefined ? updates.description : description;
    const newColor = updates.color !== undefined ? updates.color : color;
    const newDirection = updates.direction !== undefined ? updates.direction : direction;
    const newDataFlow = updates.dataFlow !== undefined ? updates.dataFlow : dataFlow;
    const newProtocol = updates.protocol !== undefined ? updates.protocol : protocol;
    const newMethod = updates.method !== undefined ? updates.method : method;
    const newDataType = updates.dataType !== undefined ? updates.dataType : dataType;

    const updatedEdge: ArchitectureEdgeType = {
      ...edge,
      data: {
        ...edge.data,
        label: newLabel,
        color: newColor,
        direction: newDirection,
        dataFlow: newDataFlow,
        edgeData: {
          protocol: newProtocol,
          method: newMethod,
          dataType: newDataType,
          description: newDescription,
          direction: newDirection === 'bi' ? 'bidirectional' : 'request',
        },
      },
    };

    onUpdate(updatedEdge);
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
            Edit Connection
          </h4>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* Label Name */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Label Name
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              handleApplyChanges({ label: e.target.value });
            }}
            placeholder="e.g. REST API, User Auth"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              handleApplyChanges({ description: e.target.value });
            }}
            placeholder="e.g. HTTPS JSON payloads"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Protocol & Method */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
              Protocol
            </label>
            <input
              type="text"
              list="protocol-options"
              value={protocol}
              onChange={(e) => {
                setProtocol(e.target.value);
                handleApplyChanges({ protocol: e.target.value });
              }}
              placeholder="http"
              className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <datalist id="protocol-options">
              {PROTOCOL_OPTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
              Method
            </label>
            <input
              type="text"
              list="method-options"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                handleApplyChanges({ method: e.target.value });
              }}
              placeholder="GET"
              className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <datalist id="method-options">
              {METHOD_OPTIONS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Data Type */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Data Payload Type
          </label>
          <input
            type="text"
            value={dataType}
            onChange={(e) => {
              setDataType(e.target.value);
              handleApplyChanges({ dataType: e.target.value });
            }}
            placeholder="JSON, Protobuf, etc."
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Direction */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Direction
          </label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDirection('uni');
                handleApplyChanges({ direction: 'uni' });
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md border py-1.5 font-medium transition-all ${
                direction === 'uni'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>One Way</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDirection('bi');
                handleApplyChanges({ direction: 'bi' });
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md border py-1.5 font-medium transition-all ${
                direction === 'bi'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Two Way</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDirection('none');
                handleApplyChanges({ direction: 'none' });
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md border py-1.5 font-medium transition-all ${
                direction === 'none'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <Minus className="h-3.5 w-3.5" />
              <span>None</span>
            </button>
          </div>
        </div>

        {/* Color Presets & Picker */}
        <div>
          <label className="mb-1 block font-medium text-zinc-600 dark:text-zinc-400">
            Color
          </label>
          <div className="flex items-center gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  handleApplyChanges({ color: c });
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
                handleApplyChanges({ color: e.target.value });
              }}
              className="ml-auto h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              title="Custom Color"
            />
          </div>
        </div>

        {/* Data Flow Animated Line Toggle */}
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-zinc-100 bg-zinc-50/50 p-2 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Animated Flow Line
          </span>
          <input
            type="checkbox"
            checked={dataFlow}
            onChange={(e) => {
              setDataFlow(e.target.checked);
              handleApplyChanges({ dataFlow: e.target.checked });
            }}
            className="h-4 w-4 cursor-pointer accent-blue-600"
          />
        </label>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between border-t pt-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => onDelete(edge.id)}
          className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Edge</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default EdgeEditor;