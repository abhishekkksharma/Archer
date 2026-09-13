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
    }[];
    url: string;
  };

  contributors: {
    username: string;
    contributions: number;
  }[];
}

class GithubServices {
  public async getRepoStats(
    user: string,
    repo: string
  ): Promise<RepoData> {
    const baseUrl = `https://api.github.com/repos/${user}/${repo}`;
    const html_base_url=`https://github.com/${user}/${repo}`

    const headers: Record<string, string> = {
      "User-Agent": "Archer-App",
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
    };

    const [repoResponse, commitsResponse, contributorsResponse] =
      await Promise.all([
        fetch(baseUrl, { headers }),
        fetch(`${baseUrl}/commits?per_page=10`, { headers }),
        fetch(`${baseUrl}/contributors?per_page=10`, { headers }),
      ]);

    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();
    const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];
    const contributorsData = contributorsResponse.ok ? await contributorsResponse.json() : [];

    const safeCommits = Array.isArray(commitsData) ? commitsData : [];
    const safeContributors = Array.isArray(contributorsData) ? contributorsData : [];

    return {
      repository: {
        name: repoData.name,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        language: repoData.language,
      },

      activity: {
        total_commits: safeCommits.length,

        commits: safeCommits.map((commit: any) => ({
          committer: commit.committer,
          message: commit.commit?.message || "",
        })),

        url: `${html_base_url}/commits`,
      },

      contributors: safeContributors.map((contributor: any) => ({
        username: contributor.login,
        contributions: contributor.contributions,
      })),
    };
  }
}

export const githubServices = new GithubServices();