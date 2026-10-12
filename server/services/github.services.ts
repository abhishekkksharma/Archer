interface RepoData {
  repository: {
    name: string;
    stars: number;
    forks: number;
    issues: number;
    language: string;
  };

  activity: {
    total_commits: number;
    commits: {
      committer: {
        login: string;
        avatar_url: string;
        html_url: string;
      } | null;
      message: string;
      date?: string;
    }[];
    daily_commits: {
      date: string;
      count: number;
    }[];
    url: string;
  };

  contributors: {
    username: string;
    contributions: number;
    avatar_url?: string;
  }[];
}

class GithubServices {
  public async getRepoStats(
    user: string,
    repo: string
  ): Promise<RepoData> {
    const baseUrl = `https://api.github.com/repos/${user}/${repo}`;
    const html_base_url = `https://github.com/${user}/${repo}`;

    const headers: Record<string, string> = {
      "User-Agent": "Archer-App",
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
    };

    const [repoResponse, commitsResponse, contributorsResponse, commitActivityResponse] =
      await Promise.all([
        fetch(baseUrl, { headers }),
        fetch(`${baseUrl}/commits?per_page=100`, { headers }),
        fetch(`${baseUrl}/contributors`, { headers }),
        fetch(`${baseUrl}/stats/commit_activity`, { headers }),
      ]);

    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();
    const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];
    const contributorsData = contributorsResponse.ok ? await contributorsResponse.json() : [];
    const commitActivityData = commitActivityResponse.ok ? await commitActivityResponse.json() : [];

    const safeCommits = Array.isArray(commitsData) ? commitsData : [];
    const safeContributors = Array.isArray(contributorsData) ? contributorsData : [];
    const totalCommits = safeContributors.reduce(
      (total: number, contributor: any) =>
        total + contributor.contributions,
      0
    );

    const dailyCommitsMap: Record<string, number> = {};

    if (Array.isArray(commitActivityData) && commitActivityData.length > 0) {
      for (const week of commitActivityData) {
        if (Array.isArray(week.days) && typeof week.week === "number") {
          week.days.forEach((count: number, dayIndex: number) => {
            const dayDate = new Date((week.week + dayIndex * 86400) * 1000);
            const dateStr = dayDate.toISOString().split("T")[0];
            if (dateStr && count > 0) {
              dailyCommitsMap[dateStr] = count;
            }
          });
        }
      }

      // Ensure any recent commits from safeCommits are recorded
      for (const commit of safeCommits) {
        const rawDate = commit.commit?.author?.date || commit.commit?.committer?.date;
        if (rawDate) {
          const dateStr = new Date(rawDate).toISOString().split("T")[0];
          if (dateStr && !dailyCommitsMap[dateStr]) {
            dailyCommitsMap[dateStr] = 1;
          }
        }
      }
    } else {
      // If commit_activity is not cached or returned 202, build from commits
      for (const commit of safeCommits) {
        const rawDate = commit.commit?.author?.date || commit.commit?.committer?.date;
        if (rawDate) {
          const dateStr = new Date(rawDate).toISOString().split("T")[0];
          if (dateStr) {
            dailyCommitsMap[dateStr] = (dailyCommitsMap[dateStr] || 0) + 1;
          }
        }
      }
    }

    const daily_commits = Object.entries(dailyCommitsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      repository: {
        name: repoData.name,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        language: repoData.language,
      },

      activity: {
        total_commits: totalCommits,

        commits: safeCommits.map((commit: any) => ({
          committer: commit.committer,
          message: commit.commit?.message || "",
          date: commit.commit?.author?.date || commit.commit?.committer?.date || "",
        })),
        daily_commits,
        url: `${html_base_url}/commits`,
      },

      contributors: safeContributors.map((contributor: any) => ({
        username: contributor.login,
        contributions: contributor.contributions,
        avatar_url: contributor.avatar_url,
      })),
    };
  }
}

export const githubServices = new GithubServices();