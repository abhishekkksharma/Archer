import React from "react";

interface ContributorsI {
  contributors: {
    username: string;
    contributions: number;
    avatar_url: string;
  }[];
}

function Contributors({ contributors }: ContributorsI) {
  const sortedContributors = [...contributors].sort(
    (a, b) => b.contributions - a.contributions
  );

  const topContributor = sortedContributors[0];
  const otherContributors = sortedContributors.slice(1);

  const maxContributions = topContributor?.contributions || 1;

  if (!topContributor) {
    return null;
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {/* Header */}
      <div className="flex w-fit items-center rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Top Contributors
          <span className="pl-4 px-2 text-base font-bold text-blue-500">
            {sortedContributors.length}
          </span>
        </p>
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Top Contributor */}
        <div className="flex w-40 shrink-0 flex-col items-center">
          <img
            src={topContributor.avatar_url}
            alt={`${topContributor.username}'s avatar`}
            className="
              h-14 w-14 rounded-full
              border-2 border-zinc-200
              object-cover
              dark:border-zinc-700
            "
          />

          <p
            className="
              mt-2 max-w-full truncate
              text-sm font-semibold
              text-zinc-800
              dark:text-zinc-200
            "
            title={topContributor.username}
          >
            {topContributor.username}
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {topContributor.contributions.toLocaleString()} commits
          </p>

          {/* Podium */}
          <div className="mt-3 flex h-36 w-full items-end justify-center">
            <div
              className="
                w-20 rounded-t-lg
                bg-zinc-200
                transition-all duration-300
                dark:bg-zinc-800
                hover:bg-blue-500
              "
              style={{
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Other Contributors */}
        <div
          className="
            flex min-w-0 flex-1 flex-col gap-2
            max-h-60
            overflow-y-auto
            pr-2
          "
        >
          {otherContributors.map((contributor, index) => {
            const percentage =
              (contributor.contributions / maxContributions) * 100;

            return (
              <div
                key={contributor.username}
                className="
                  group flex items-center gap-3
                  rounded-lg px-2 py-1.5
                  transition-colors duration-200
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-900
                "
              >
                {/* Rank */}
                <span className="w-5 text-xs font-medium text-zinc-400">
                  {index + 2}
                </span>

                {/* Avatar */}
                <img
                  src={contributor.avatar_url}
                  alt={`${contributor.username}'s avatar`}
                  className="
                    h-8 w-8 shrink-0 rounded-full
                    border border-zinc-200
                    object-cover
                    dark:border-zinc-700
                  "
                />

                {/* Username */}
                <p
                  className="
                    w-24 shrink-0 truncate
                    text-sm font-medium
                    text-zinc-700
                    dark:text-zinc-300
                  "
                  title={contributor.username}
                >
                  {contributor.username}
                </p>

                {/* Contribution bar */}
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="
                      h-full rounded-full
                      bg-zinc-400
                      transition-all duration-300
                      group-hover:bg-zinc-600
                      dark:bg-zinc-600
                      dark:group-hover:bg-zinc-400
                    "
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                {/* Contributions */}
                <span className="w-16 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {contributor.contributions.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Contributors;