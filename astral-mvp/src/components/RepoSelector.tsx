'use client';

import { Repository } from '@/types';

interface RepoSelectorProps {
  repos: Repository[];
  selectedRepo: string | null;
  onSelect: (repoId: string | null) => void;
}

export default function RepoSelector({ repos, selectedRepo, onSelect }: RepoSelectorProps) {
  return (
    <div className="card">
      <h2 className="card-title">Repositories</h2>

      <div className="repo-list">
        <button
          onClick={() => onSelect(null)}
          className={`repo-item ${selectedRepo === null ? 'active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
            <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
            <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
            <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
          </svg>
          <span>All Repositories</span>
        </button>

        {repos.map((repo) => (
          <button
            key={repo.id}
            onClick={() => onSelect(repo.id)}
            className={`repo-item ${selectedRepo === repo.id ? 'active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 5.5L2 12.5C2 13.0523 2.44772 13.5 3 13.5H13C13.5523 13.5 14 13.0523 14 12.5V6.5C14 5.94772 13.5523 5.5 13 5.5H8.5L7 3.5H3C2.44772 3.5 2 3.94772 2 4.5V5.5Z" />
            </svg>
            <div className="repo-item-info">
              <span className="repo-name">{repo.name}</span>
              <span className="repo-owner">{repo.owner}</span>
            </div>
            {repo.language !== 'Unknown' && (
              <span className="repo-lang">{repo.language}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
