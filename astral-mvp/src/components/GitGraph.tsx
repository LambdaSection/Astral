'use client';

import { Commit } from '@/types';

interface GitGraphProps {
  commits: Commit[];
}

const COLORS = ['#5B5FC7', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

export default function GitGraph({ commits }: GitGraphProps) {
  const repos = Array.from(new Set(commits.map(c => c.repoName)));

  if (commits.length === 0) {
    return (
      <div className="card card-empty">
        <p>No commits to visualize</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">Timeline</h3>

      <div className="timeline">
        {repos.map((repoName, ri) => {
          const repoCommits = commits.filter(c => c.repoName === repoName).slice(0, 6);
          const color = COLORS[ri % COLORS.length];

          return (
            <div key={repoName} className="timeline-repo">
              <div className="timeline-repo-header">
                <span className="timeline-dot" style={{ backgroundColor: color }} />
                <span className="timeline-repo-name">{repoName}</span>
              </div>

              <div className="timeline-commits">
                {repoCommits.map((commit) => (
                  <div key={commit.id} className="timeline-commit">
                    <div
                      className={`timeline-node ${commit.isAgent ? 'agent' : ''}`}
                      style={{ borderColor: color }}
                    />
                    <div className="timeline-commit-body">
                      <div className="timeline-commit-top">
                        <code>{commit.sha}</code>
                        {commit.isAgent && <span className="tag-agent">Agent</span>}
                      </div>
                      <p className="timeline-commit-msg">{commit.message}</p>
                      <span className="timeline-commit-meta">
                        {commit.author} -- {new Date(commit.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
