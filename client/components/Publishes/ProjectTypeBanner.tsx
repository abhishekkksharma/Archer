import React from 'react'
import {
    Globe,
    Smartphone,
    Monitor,
    Server,
    BrainCircuit,
    Terminal,
    Gamepad2,
    BadgePlus,
    type LucideIcon,
} from 'lucide-react'

export const PROJECT_TYPES = [
    "Web Application",
    "Full Stack Application",
    "Mobile Application",
    "Desktop Application",
    "API / Backend Service",
    "AI / ML Application",
    "CLI Tool",
    "Chrome Extension",
    "Game Development",
] as const

type ProjectType = typeof PROJECT_TYPES[number]

const PROJECT_TYPE_ICONS: Record<ProjectType, LucideIcon> = {
    "Web Application": Globe,
    "Full Stack Application": Globe,
    "Mobile Application": Smartphone,
    "Desktop Application": Monitor,
    "API / Backend Service": Server,
    "AI / ML Application": BrainCircuit,
    "CLI Tool": Terminal,
    "Chrome Extension": BadgePlus,
    "Game Development": Gamepad2,
}

function getProjectTypeIcon(projectType: string): LucideIcon | null {
    return PROJECT_TYPE_ICONS[projectType as ProjectType] ?? null
}

function ProjectTypeBanner({ projectType }: { projectType: string }) {
    const Icon = getProjectTypeIcon(projectType)

    if (!Icon) {
        return <div />
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-18 w-18 text-zinc-300 dark:text-zinc-800" />
        </div>
    )
}

export default ProjectTypeBanner