import {
    Handle,
    Position,
    type Node,
    type NodeProps,
} from "@xyflow/react";
import { getTechIcon } from "@/assets/tech-icons/tech-icons";
import Image from "next/image";

interface ServiceNodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    technology?: string;
    color?: string;
    size?: number;
}

type ServiceNodeType = Node<ServiceNodeData>;

function ServiceNode2({ data }: NodeProps<ServiceNodeType>) {
    const accentColor = data.color ?? "#3b82f6";
    const techIcon = data.technology
        ? getTechIcon(data.technology)
        : null;

    return (
        <div className="group justify-center items-center flex flex-col">

            <div className={`relative ${techIcon == null ? "w-45" : "pr-4"} py-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition-shadow 
                            hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20 `}>
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
                />

                <div className="flex min-w-0 items-center gap-2">
                    {techIcon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                            <Image
                                className="h-10 w-10 object-contain p-2"
                                src={techIcon}
                                alt="tech-icon"
                                width={40}
                                height={40}
                            />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {data.label}
                        </p>

                        {data.technology && (
                            <p className="mt-0.5 truncate text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                {data.technology}
                            </p>
                        )}
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
                />
            </div>
            <div className="rounded-lg absolute top-16 w-56 hidden group-hover:flex duration-700 border border-zinc-200/60 bg-zinc-100 p-1.5 dark:border-zinc-800/80 dark:bg-zinc-900">
                <p className="text-xs leading-4 text-zinc-700 dark:text-zinc-200">
                    {data.description}
                </p>
            </div>
        </div>
    );
}

export default ServiceNode2;