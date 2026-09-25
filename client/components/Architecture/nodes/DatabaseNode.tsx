import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { Database } from 'lucide-react';

type DatabaseNodeData = {
  label: string;
  description?: string;
  technology?: string;
  color?: string;
  size?: number;
};

type DatabaseNodeType = Node<DatabaseNodeData, 'database'>;

export default function DatabaseNode({
  data,
}: NodeProps<DatabaseNodeType>) {
  const color = data.color ?? '#0D47A1';
  const size = data.size ?? 100;
  const iconSize = size * 0.75;

  return (
    <div
      className="group relative flex flex-col items-center"
      style={{
        width: iconSize,
      }}
    >
      {/* Database Icon */}
      <div
        className="
          flex items-center justify-center
          transition-transform duration-200
          group-hover:scale-105
        "
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        <Database
          size={iconSize}
          strokeWidth={1.2}
          className=''
          color={color}
        />
      </div>

      {/* Label */}
      <span className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
        Database
      </span>

      {/* Hover Information */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-full
          z-100
          mt-2
          w-50
          -translate-x-1/2
          translate-y-1

          rounded-lg
          border
          border-gray-200
          bg-white
          p-3

          text-left
          opacity-0
          shadow-lg

          transition-all
          duration-200

          dark:border-gray-800
          dark:bg-black
          dark:shadow-black/40

          group-hover:pointer-events-auto
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {data.label}
        </h3>

        {/* Description */}
        {data.description && (
          <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {data.description}
          </p>
        )}

        {/* Technology */}
        {data.technology && (
          <div
            className="
              mt-2
              inline-block
              rounded-md
              px-2
              py-1
              text-[11px]
              font-medium
            "
            style={{
              color,
              backgroundColor: `${color}18`,
            }}
          >
            {data.technology}
          </div>
        )}
      </div>

      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="
          !h-3
          !w-3
          !border-2
          !border-white
          dark:!border-gray-900
        "
        style={{
          top: `${iconSize / 2}px`,
          backgroundColor: color,
        }}
      />

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="
          h-3!
          w-3!
          border-2!
          border-white!
          dark:border-gray-900!
        "
        style={{
          top: `${iconSize / 2}px`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}