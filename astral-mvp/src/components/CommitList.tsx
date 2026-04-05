'use client';

import { Commit } from '@/types';

interface CommitListProps {
  commits: Commit[];
  loading: boolean;
}

export default function CommitList({ commits, loading }: CommitListProps) {
  if (loading) {
    return (
      <div className="card card-empty">
        <div className="spinner" />
        <p>Loading commits...</p>
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="card card-empty">
        <p>No commits found</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">Recent Commits</h3>
      <div className="commit-list">
        {commits.map((commit) => (
          <div key={commit.id} className="commit-row">
            <div className={`commit-avatar ${commit.isAgent ? 'agent' : 'human'}`}>
              {commit.isAgent ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                  <path d="M9 15h6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-1a7 7 0 0114 0v1" />
                </svg>
              )}
            </div>
            <div className="commit-body">
              <div className="commit-meta">
                <code className="commit-sha">{commit.sha}</code>
                <span className={`commit-tag ${commit.isAgent ? 'agent' : 'human'}`}>
                  {commit.isAgent ? 'Agent' : 'Human'}
                </span>
              </div>
              <p className="commit-message">{commit.message}</p>
              <div className="commit-info">
                <span>{commit.author}</span>
                <span>{new Date(commit.date).toLocaleString()}</span>
                <span className="commit-repo">{commit.repoName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
