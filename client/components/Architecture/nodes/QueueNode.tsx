import {
  Handle,
  Position,
} from '@xyflow/react';

export default function QueueNode({ data }: any) {
  return (
    <div className="min-w-[220px] rounded-md border border-orange-300 bg-orange-50 px-4 py-3">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-orange-500"
      />

      <div className="text-sm font-semibold text-gray-900">
        {data.label}
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {data.description}
      </div>

      <div className="mt-2 text-xs font-medium text-orange-600">
        {data.technology}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-orange-500"
      />
    </div>
  );
}