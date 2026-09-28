import React from "react";
import { Monitor } from "lucide-react";
import { BaseNodeData } from "./BaseArchitectureNode";
import {
  Handle,
  Position,
} from "@xyflow/react";

function FrontendNew({ data }: any) {
  const nodeData = data as BaseNodeData;

  return (
    <div className="group relative flex w-[140px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-center transition-all duration-200 hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:shadow-lg dark:hover:shadow-black/20">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
      />

      {nodeData.icon ? (
        <span className="max-w-full break-words text-2xl">
          {nodeData.icon}
        </span>
      ) : (
        <Monitor className="h-8 w-8 shrink-0 text-blue-800 dark:text-blue-400" />
      )}

      <p className="mt-1 w-full break-words whitespace-normal text-sm font-medium leading-tight text-zinc-800 dark:text-zinc-200">
        {nodeData.label}
      </p>

      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[220px] -translate-x-1/2 translate-y-1 rounded-xl border border-zinc-200 bg-white p-3 text-left opacity-0 shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-xl dark:shadow-black/30">
        {nodeData.description && (
          <p className="break-words whitespace-normal text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {nodeData.description}
          </p>
        )}

        {nodeData.technology && (
          <div className="mt-3 border-t border-zinc-200 pt-2 dark:border-zinc-800">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Technology
            </p>

            <p className="mt-1 break-words whitespace-normal text-xs font-semibold text-blue-600 dark:text-blue-400">
              {nodeData.technology}
            </p>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
      />
    </div>
  );
}

export default FrontendNew;