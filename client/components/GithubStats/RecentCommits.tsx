
interface RecentCommitsI {
  commits: {
    committer: {
      login: string;
      avatar_url: string;
      html_url: string;
    } | null;
    message: string;
  }[];
  activity: {
    total_commits: number;
    commits: {
      committer: { login: string; avatar_url: string; html_url: string } | null;
      message: string;
    }[];
    url: string;
  };
}

function RecentCommits({ commits,activity }: RecentCommitsI) {
  return (
    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 gap-1 max-w-xl h-80 overflow-scroll px-2">
        <div className="flex justify-between border-b-0 items-center  sticky top-0 px-2">
        <p className="py-2 font-semibold"><span className="bg-white/80 dark:bg-zinc-950/70 p-1 rounded">Recent Commits</span></p>
        <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View on GitHub &rarr;
            </a>
        </div>
      {commits.map((commit, index) => {
        const username = commit.committer?.login ?? "Unknown user";
        const avatar = commit.committer?.avatar_url;

        return (
          <div
            key={`${username}-${index}`}
            className="
              group flex items-center gap-3
              px-3 py-3
              transition-colors duration-200
              hover:bg-zinc-50
              dark:hover:bg-zinc-900/60
              bg-zinc-100/50
              dark:bg-zinc-900
              rounded-2xl
            "
          >
            {/* Avatar */}
            {avatar ? (
              <img
                src={avatar}
                alt={`${username}'s GitHub profile`}
                width={36}
                height={36}
                className="
                  h-9 w-9 shrink-0
                  rounded-full
                  border border-zinc-200
                  dark:border-zinc-700
                "
              />
            ) : (
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-zinc-100
                  text-sm font-semibold
                  text-zinc-500
                  dark:bg-zinc-800
                  dark:text-zinc-400
                "
              >
                ?
              </div>
            )}

            {/* Commit information */}
            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm font-medium
                  text-zinc-800
                  dark:text-zinc-200
                "
                title={commit.message}
              >
                {commit.message.split("\n")[0]}
              </p>

              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                by{" "}
                <span className="font-medium text-zinc-600 dark:text-zinc-400">
                  {username}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentCommits;