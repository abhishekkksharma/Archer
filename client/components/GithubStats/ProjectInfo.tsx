import { GitFork, Star, GitGraph } from "lucide-react";

interface ProjectPropsI {
  forks: number;
  stars: number;
  total_commits: number;
}

function ProjectInfo({
  forks,
  stars,
  total_commits,
}: ProjectPropsI) {
  const stats = [
    {
      label: "Forks",
      value: forks,
      icon: GitFork,
    },
    {
      label: "Stars",
      value: stars,
      icon: Star,
    },
    {
      label: "Commits",
      value: total_commits,
      icon: GitGraph,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="
            group flex items-center gap-2
            w-fit
            rounded-lg
            border border-zinc-200/80
            bg-white/70
            px-3 py-1.5
            text-sm
            shadow-sm

            transition-all duration-200 ease-out

            hover:-translate-y-0.5
            hover:border-zinc-300
            hover:bg-white
            hover:shadow-md

            dark:border-zinc-700/70
            dark:bg-zinc-900/60
            dark:hover:border-zinc-600
            dark:hover:bg-zinc-900
            dark:hover:shadow-black/20
          "
        >
          <Icon
            className="
              h-4 w-4
              shrink-0
              text-zinc-500
              transition-colors duration-200

              group-hover:text-zinc-800

              dark:text-zinc-400
              dark:group-hover:text-zinc-200
            "
            strokeWidth={2}
          />

          <span
            className="
              font-medium
              text-zinc-500
              dark:text-zinc-400
            "
          >
            {label}
          </span>

          <span
            className="
              font-semibold
              tabular-nums
              text-zinc-900
              dark:text-zinc-100
            "
          >
            {value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProjectInfo;
