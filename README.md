# brother-ql-node

[![CI](https://github.com/bankersman/brother_ql_node/actions/workflows/ci.yml/badge.svg)](https://github.com/bankersman/brother_ql_node/actions/workflows/ci.yml)
[![Pages](https://github.com/bankersman/brother_ql_node/actions/workflows/pages.yml/badge.svg)](https://bankersman.github.io/brother_ql_node/)
[![codecov](https://codecov.io/gh/bankersman/brother_ql_node/graph/badge.svg)](https://codecov.io/gh/bankersman/brother_ql_node)

TypeScript workspace for Brother QL printing on modern Node.js, with incremental parity against upstream [`brother_ql`](https://github.com/pklaus/brother_ql).

**Credits** — This project owes a great deal to **Philipp Klaus** and the [brother_ql](https://github.com/pklaus/brother_ql) Python library: protocol reverse engineering, model and label registries, and a de facto reference implementation the community has relied on for years. `brother-ql-node` is an independent TypeScript port and is not affiliated with Brother Industries.

## Documentation

- **Live site:** [https://bankersman.github.io/brother_ql_node/](https://bankersman.github.io/brother_ql_node/)
- VitePress source: `docs/` (pages under `docs/src/`)
- Local preview: `pnpm docs:dev`
- Production build (same as GitHub Pages): `pnpm docs:build`

## Usage (clone this repository)

Packages are workspace `private` today: clone the repo, install once, then import from `packages/...` paths (or wire your app into the workspace). Use **Node.js 24+** to match `engines` and CI.

From the repository root after `pnpm install`:

### Print over TCP (`@brother-ql/node`)

Save as `print-tcp.ts` next to `package.json` and run `pnpm exec tsx print-tcp.ts` (adjust `host` / `model` / `label` for your printer):

```typescript
import { BrotherQlNodeClient } from "./packages/node/src/index.js";

const client = new BrotherQlNodeClient({
  backend: "tcp",
  host: "192.168.1.50",
  port: 9100
});

const result = await client.print({
  model: "QL-710W",
  label: "62",
  imageBytes: new Uint8Array([255, 255, 0, 0]),
  timeoutMs: 2000
});

console.log(result);
```

### Print over USB (`@brother-ql/node`)

```typescript
import { BrotherQlNodeClient } from "./packages/node/src/index.js";

const client = new BrotherQlNodeClient({ backend: "usb" });

const result = await client.print({
  model: "QL-820NWB",
  label: "62",
  imageBytes: new Uint8Array([255, 255, 0, 0])
});

console.log(result);
```

USB needs the native `usb` dependency and OS permissions; see the docs site for practical notes.

### CLI (`@brother-ql/cli`)

`runCli` is the programmatic entry (a thin shell binary is not wired yet). Example from the repo root:

```typescript
import { runCli } from "./packages/cli/src/index.js";

console.log(
  runCli(["info", "models"]).output.split("\n").slice(0, 8).join("\n")
);
console.log(
  runCli(["info", "labels"]).output.split("\n").slice(0, 8).join("\n")
);
```

Defaults come from env: `BROTHER_QL_BACKEND`, `BROTHER_QL_MODEL`, `BROTHER_QL_PRINTER`. The default runtime still stubs `print` / `send` / `discover` strings; `info models` and `info labels` use the real registry.

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
