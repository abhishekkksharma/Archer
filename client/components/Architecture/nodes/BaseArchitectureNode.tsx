import {
  Handle,
  Position,
  type NodeProps,
} from '@xyflow/react';

export type BaseNodeData = {
  label: string;
  description?: string;
  technology?: string;
  icon?: string;
};

export default function BaseArchitectureNode({
  data,
}: NodeProps<any>) {
  return (
    <div className="min-w-[220px] rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !bg-blue-500"
      />

      <div className="flex items-center gap-2">
        {data.icon && (
          <span className="text-lg">
            {data.icon}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-900">
          {data.label}
        </h3>
      </div>

      {data.description && (
        <p className="mt-1 text-xs text-gray-500">
          {data.description}
        </p>
      )}

      {data.technology && (
        <p className="mt-2 text-xs font-medium text-blue-600">
          {data.technology}
        </p>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !bg-blue-500"
      />
    </div>
  );
}