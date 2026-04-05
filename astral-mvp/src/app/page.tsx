'use client';

import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, fetchUserRepos, analyzeRepos, generateDigest } from '@/services/github';
import { Repository, AnalysisResult } from '@/types';
import TokenInput from '@/components/TokenInput';
import RepoSelector from '@/components/RepoSelector';
import CommitList from '@/components/CommitList';
import GitGraph from '@/components/GitGraph';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setConnected(true);
      loadRepos();
    }
  }, []);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRepos = await fetchUserRepos();
      setRepos(fetchedRepos);
      if (fetchedRepos.length > 0) {
        const analysisResults = await analyzeRepos(fetchedRepos.slice(0, 5), 7);
        setResults(analysisResults);
      }
    } catch (err: any) {
      setError(err?.response?.status === 401
        ? 'Invalid token. Please reconnect.'
        : 'Failed to load repos. Check your connection.');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnected = useCallback(() => {
    setConnected(true);
    loadRepos();
  }, []);

  // Filtered view
  const filteredResults = selectedRepo
    ? results.filter(r => r.repo.id === selectedRepo)
    : results;

  const allCommits = filteredResults
    .flatMap(r => r.commits)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCommits = filteredResults.reduce((s, r) => s + r.stats.totalCommits, 0);
  const agentCommits = filteredResults.reduce((s, r) => s + r.stats.agentCommits, 0);
  const humanCommits = filteredResults.reduce((s, r) => s + r.stats.humanCommits, 0);
  const contributors = new Set<string>();
  filteredResults.forEach(r => r.stats.contributors.forEach(c => contributors.add(c)));

  if (!connected) {
    return (
      <div className="app">
        <TokenInput onConnected={handleConnected} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>Astral</h1>
          <span>Multi-Repo Intelligence</span>
        </div>
        <div className="header-stats">
          {!loading && (
            <>
              <span><strong>{repos.length}</strong> repos</span>
              <span><strong>{totalCommits}</strong> commits (7d)</span>
              <span><strong>{humanCommits}</strong> human / <strong>{agentCommits}</strong> agent</span>
            </>
          )}
        </div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <RepoSelector
            repos={repos}
            selectedRepo={selectedRepo}
            onSelect={setSelectedRepo}
          />
        </aside>

        <main className="content">
          {error && (
            <div className="card" style={{ borderColor: 'var(--color-danger)', marginBottom: 16 }}>
              <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="card card-empty">
              <div className="spinner" />
              <p>Analyzing repositories...</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-value">{totalCommits}</span>
                  <span className="stat-label">Commits</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{contributors.size}</span>
                  <span className="stat-label">Contributors</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{humanCommits}</span>
                  <span className="stat-label">Human</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{agentCommits}</span>
                  <span className="stat-label">Agent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{filteredResults.length}</span>
                  <span className="stat-label">Repos</span>
                </div>
              </div>

              <div className="content-grid">
                {/* Commit list */}
                <div>
                  <CommitList commits={allCommits.slice(0, 20)} loading={false} />
                </div>

                {/* Timeline */}
                <div>
                  <GitGraph commits={allCommits} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
