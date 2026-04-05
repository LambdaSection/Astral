export interface Commit {
	id: string;
	sha: string;
	message: string;
	author: string;
	email?: string;
	date: string;
	repoId: string;
	repoName: string;
	isAgent?: boolean;
	stats?: {
		additions: number;
		deletions: number;
	};
	files?: string[];
}

export interface Repository {
	id: string;
	owner: string;
	name: string;
	fullName: string;
	description: string;
	stars: number;
	forks: number;
	language: string;
	updatedAt: string;
}

export interface AnalysisResult {
	repo: Repository;
	commits: Commit[];
	stats: {
		totalCommits: number;
		totalAdditions: number;
		totalDeletions: number;
		contributors: string[];
		filesChanged: string[];
		agentCommits: number;
		humanCommits: number;
	};
}
