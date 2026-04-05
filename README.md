# Astral

AI Agent for Multi-Repo and Monorepo Intelligence.

## What is Astral

Astral is an open-source intelligence platform that gives engineering teams unified visibility across all their repositories. It understands workspace structures, tracks cross-repo dependencies, and distinguishes human from AI agent activity.

Current AI coding tools (Cursor, Claude Code, etc.) fail at enterprise scale -- they freeze on large codebases, lack monorepo semantics, and cannot reason across project boundaries. Astral fills that gap.

## Core Capabilities

**Unified Activity Dashboard** -- Single view of all changes across all repos. Timeline visualization, filtering by agent/user/repo, real-time notifications.

**Workspace Graph Understanding** -- Native parsing of Nx, Turborepo, Lerna, Rush, Bazel structures. Project-level dependency graph, boundary and constraint awareness.

**Cross-Repository Context** -- Index multiple repos with inter-repo relations. Answer "what depends on this?" and "what is the impact of this change?" across boundaries.

**Agent Attribution** -- Every change tagged as human or agent. Full audit trail of who did what, when, where. Human-agent collaboration visible on one board.

**Enterprise Scale** -- Streaming indexing for 100k+ file repos. Lazy context loading. No freezes, no memory exhaustion.

## Getting started (MVP)

```bash
cd astral-mvp
npm install
npm run dev
```

Open `http://localhost:3000`, enter a GitHub Personal Access Token, and your repos load automatically.

## Project structure

```
astral-mvp/       -- Next.js application (MVP prototype)
docs/
  strategy/       -- Product direction, PRD, pivot docs
  validation/     -- Mom Test, desk research, evidence
```

## Status

Startup project -- validation phase. Desk research complete (GO verdict, 13 sources, 9 behavioral proofs). MVP prototype in progress.

## Target Users

- Platform Engineers in monorepo organizations (50k+ files, 100+ packages)
- Senior Developers in multi-repo setups (microservices, 20+ repos)
- DevEx Teams managing developer productivity at scale

## License

See LICENSE.txt
