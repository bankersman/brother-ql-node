# brother-ql-node

[![CI](https://github.com/owner/brother-ql-node/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/brother-ql-node/actions/workflows/ci.yml)
[![Pages](https://github.com/owner/brother-ql-node/actions/workflows/pages.yml/badge.svg)](https://github.com/owner/brother-ql-node/actions/workflows/pages.yml)

TypeScript workspace for Brother QL printing on modern Node.js, with incremental parity against upstream `brother_ql`.

## Documentation

- User docs (VitePress source): `docs/src`
- Run docs locally: `pnpm docs:dev`
- Build docs for CI/pages: `pnpm docs:build`
- Upstream inspiration and protocol groundwork: [https://github.com/pklaus/brother_ql](https://github.com/pklaus/brother_ql)

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
