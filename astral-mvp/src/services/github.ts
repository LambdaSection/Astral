import axios from 'axios';
import { Commit, Repository, AnalysisResult } from '@/types';

const GITHUB_API = 'https://api.github.com';

// --- Token management ---

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('github_token');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('github_token', token);
  }
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('github_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// --- API helpers ---

function headers() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

// --- Fetch user repos ---

export async function fetchUserRepos(): Promise<Repository[]> {
  const res = await axios.get(`${GITHUB_API}/user/repos`, {
    headers: headers(),
    params: { sort: 'updated', per_page: 30 },
  });

  return res.data.map((r: any) => ({
    id: r.id.toString(),
    owner: r.owner.login,
    name: r.name,
    fullName: r.full_name,
    description: r.description || '',
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || 'Unknown',
    updatedAt: r.updated_at,
  }));
}

// --- Fetch commits ---

export async function fetchCommits(
  owner: string,
  repo: string,
  since?: string,
): Promise<Commit[]> {
  const params: Record<string, string | number> = { per_page: 30 };
  if (since) params.since = since;

  const res = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}/commits`,
    { headers: headers(), params },
  );

  return res.data.map((item: any) => ({
    id: item.sha,
    sha: item.sha.substring(0, 7),
    message: item.commit.message.split('\n')[0],
    author: item.commit.author.name,
    email: item.commit.author.email || '',
    date: item.commit.author.date,
    repoId: `${owner}/${repo}`,
    repoName: `${owner}/${repo}`,
    isAgent: detectAgent(item.commit.author.name, item.commit.message),
  }));
}

// --- Agent detection ---

function detectAgent(author: string, message: string): boolean {
  const patterns = [
    /bot/i, /\[bot\]/i, /agent/i, /\[agent\]/i,
    /github-actions/i, /dependabot/i, /renovate/i,
    /automated/i, /semantic-release/i, /ci\//i,
  ];
  const text = `${author} ${message}`;
  return patterns.some(p => p.test(text));
}

// --- Multi-repo analysis ---

export async function analyzeRepos(
  repos: Repository[],
  daysBack: number = 7,
): Promise<AnalysisResult[]> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceISO = since.toISOString();

  const results: AnalysisResult[] = [];

  for (const repo of repos) {
    try {
      const commits = await fetchCommits(repo.owner, repo.name, sinceISO);

      const contributors = new Set<string>();
      const allFiles = new Set<string>();
      let additions = 0;
      let deletions = 0;
      let agentCount = 0;
      let humanCount = 0;

      commits.forEach(c => {
        contributors.add(c.author);
        additions += c.stats?.additions || 0;
        deletions += c.stats?.deletions || 0;
        c.files?.forEach(f => allFiles.add(f));
        if (c.isAgent) agentCount++; else humanCount++;
      });

      results.push({
        repo,
        commits,
        stats: {
          totalCommits: commits.length,
          totalAdditions: additions,
          totalDeletions: deletions,
          contributors: Array.from(contributors),
          filesChanged: Array.from(allFiles),
          agentCommits: agentCount,
          humanCommits: humanCount,
        },
      });
    } catch (err) {
      console.error(`Failed to analyze ${repo.fullName}:`, err);
    }
  }

  return results;
}

// --- Daily digest (no emojis, Rule 9) ---

export function generateDigest(results: AnalysisResult[]): string {
  const total = results.reduce((s, r) => s + r.stats.totalCommits, 0);
  const agents = results.reduce((s, r) => s + r.stats.agentCommits, 0);
  const humans = results.reduce((s, r) => s + r.stats.humanCommits, 0);
  const allContributors = new Set<string>();
  results.forEach(r => r.stats.contributors.forEach(c => allContributors.add(c)));

  const allCommits = results.flatMap(r => r.commits);

  const lines = [
    `Multi-Repo Digest -- ${new Date().toLocaleDateString()}`,
    '',
    'Activity',
    `  ${total} commits across ${results.length} repos`,
    `  ${allContributors.size} contributors`,
    `  ${agents} agent commits (${total ? Math.round(agents / total * 100) : 0}%)`,
    `  ${humans} human commits (${total ? Math.round(humans / total * 100) : 0}%)`,
    '',
    'Repositories',
    ...results.map(r =>
      `  ${r.repo.fullName}: ${r.commits.length} commits`
    ),
    '',
    'Recent',
    ...allCommits.slice(0, 5).map(c =>
      `  [${c.repoName.split('/').pop()}] ${c.sha} ${c.message.substring(0, 60)}`
    ),
  ];

  return lines.join('\n');
}
