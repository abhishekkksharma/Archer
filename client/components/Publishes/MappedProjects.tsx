"use client";

import React, { useEffect, useState } from "react";

interface Project {
    _id: string;
    name: string;
    projectType?: string;
}

interface MappedProjectsProps {
    projectType?: string;
}

const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

function MappedProjects({ projectType }: MappedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedType, setSelectedType] = useState(projectType || "");

    const getProjects = async () => {
        try {
            const url = new URL(`${BASE_URL}/published/project`);

            if (selectedType) {
                url.searchParams.set("projectType", selectedType);
            }

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        getProjects();
    }, [selectedType]);

    return (
        <section className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <p className="text-xl font-semibold">
                    Published projects
                </p>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
                >
                    <option value="">All</option>
                    <option value="Web Application">
                        Web Application
                    </option>
                    <option value="Mobile Application">
                        Mobile Application
                    </option>
                </select>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id}>
                            <p>{project.name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-zinc-500">
                        No published projects found.
                    </p>
                )}
            </div>
        </section>
    );
}

export default MappedProjects;