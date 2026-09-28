import { BaseNodeData } from "./BaseArchitectureNode";
import { Server } from "lucide-react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { getTechIcon } from "@/assets/tech-icons/tech-icons";
import Image from "next/image";

function ServiceNodeContainer({ data }: any) {
  const nodeData = data as BaseNodeData;

  const techIcon = nodeData.technology
    ? getTechIcon(nodeData.technology)
    : null;

  return (
    <div className="group relative flex max-w-32 flex-col items-center justify-center rounded-2xl px-1 py-2 text-center transition-all duration-200">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-blue-500 !opacity-0 transition-opacity duration-200 group-hover:!opacity-100 dark:!bg-blue-400"
      />

      <div className="flex h-16 w-16 items-center justify-center">
        {techIcon ? (
          <Image
            src={techIcon}
            alt={nodeData.technology || "Technology"}
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
        ) : (
          <Server className="h-12 w-12 text-zinc-800 dark:text-zinc-200" />
        )}
      </div>

      <p className="mt-1 w-full wrap-break-words whitespace-normal text-sm font-medium leading-tight text-zinc-800 dark:text-zinc-200">
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

            <div className="mt-1 flex items-center gap-2">
              {techIcon && (
                <Image
                  src={techIcon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              )}

              <p className="break-words text-xs font-semibold text-blue-600 dark:text-blue-400">
                {nodeData.technology}
              </p>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-blue-500 !opacity-0 transition-opacity duration-200 group-hover:!opacity-100 dark:!bg-blue-400"
      />
    </div>
  );
}

export default ServiceNodeContainer;