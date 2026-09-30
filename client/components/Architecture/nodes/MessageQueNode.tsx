import React from 'react'
import { BaseNodeData } from './BaseArchitectureNode'
import {
    Handle,
    Position,
} from "@xyflow/react";
import { ListEnd } from "lucide-react"
import { getTechIcon } from '@/assets/tech-icons/tech-icons';
import Image from 'next/image';

function MessageQueNode({ data }: any) {
    const nodeData: BaseNodeData = data;
    const techIcon = data.technology
        ? getTechIcon(data.technology)
        : null;

    return (
        <div className='group w-50'>
            <div>
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!h-2 !w-2 !border-0 !bg-blue-500 dark:!bg-blue-400"
                />
                <div className='flex flex-row p-2 gap-3 justify-center items-center bg-white dark:bg-black border-2 rounded-xl border-zinc-400/50 dark:border-zinc-600/40'>
                    <div>
                        {techIcon ? (
                            <div>
                                <Image className='w-6 h-6 dark:invert' src={techIcon} alt='tech-icon' />
                            </div>
                        ) : (
                            <ListEnd className='w-6 h-6 -scale-x-100' />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {nodeData.label}
                    </p>

                    {nodeData.technology && (
                        <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-500">
                            {nodeData.technology}
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
            <div className="rounded-lg absolute w-50 mt-2 hidden group-hover:flex duration-700 border border-zinc-200/60 bg-zinc-100 p-1.5 dark:border-zinc-800/80 dark:bg-zinc-900">
                <p className="text-xs leading-4 text-zinc-700 dark:text-zinc-200">
                    {data.description}
                </p>
            </div>
        </div>
    )
}

export default MessageQueNode