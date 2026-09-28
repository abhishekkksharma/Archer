import {
    Handle,
    Position,
    type Node,
    type NodeProps,
} from "@xyflow/react";

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

    return (
        <div className="group justify-center items-center flex flex-col">

            <div className="relative w-40 py-2 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
                />

                <div>
                    <p className="px-2 pb-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {data.label}
                    </p>

                    <div className="px-2 ">
                        <p className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">
                            {data.technology}
                        </p>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
                />


            </div>
            <div className="rounded-lg absolute top-15 w-56 hidden group-hover:flex duration-700 border border-zinc-200/60 bg-zinc-100 p-1.5 dark:border-zinc-800/80 dark:bg-zinc-900">
                <p className="text-xs leading-4 text-zinc-700 dark:text-zinc-200">
                    {data.description}
                </p>
            </div>
        </div>
    );
}

export default ServiceNode2;