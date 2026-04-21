# brother-ql-node

[![CI](https://github.com/bankersman/brother_ql_node/actions/workflows/ci.yml/badge.svg)](https://github.com/bankersman/brother_ql_node/actions/workflows/ci.yml)
[![Pages](https://github.com/bankersman/brother_ql_node/actions/workflows/pages.yml/badge.svg)](https://github.com/bankersman/brother_ql_node/actions/workflows/pages.yml)
[![codecov](https://codecov.io/gh/bankersman/brother_ql_node/graph/badge.svg)](https://codecov.io/gh/bankersman/brother_ql_node)

TypeScript workspace for Brother QL printing on modern Node.js, with incremental parity against upstream [`brother_ql`](https://github.com/pklaus/brother_ql).

**Credits** — This project owes a great deal to **Philipp Klaus** and the [brother_ql](https://github.com/pklaus/brother_ql) Python library: protocol reverse engineering, model and label registries, and a de facto reference implementation the community has relied on for years. `brother-ql-node` is an independent TypeScript port and is not affiliated with Brother Industries.

## Documentation

- VitePress root: `docs/` (Markdown pages under `docs/src/`)
- Local preview: `pnpm docs:dev`
- Production build (also used by GitHub Pages): `pnpm docs:build`
- Published site: workflow [Pages](https://github.com/bankersman/brother_ql_node/actions/workflows/pages.yml) on the `main` branch

## Packages

- `@brother-ql/core`: contracts, command generation, parity harness, and blocking send semantics.
- `@brother-ql/transport-node`: TCP and USB transport implementations.
- `@brother-ql/node`: high-level SDK for Node applications.
- `@brother-ql/cli`: V1 parity command surface for common operations.
- `@brother-ql/transport-web`: stretch package for browser transport experiments.

## Development

- Install dependencies: `pnpm install`
- Validate quality gates:
  - `pnpm lint`
  - `pnpm format:check`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage` (coverage report and thresholds; uploads in CI when Codecov is configured)
