# @brother-ql/cli

**@brother-ql/cli** exposes a **parity-oriented command surface** for Brother QL workflows (for example `info models`, `info labels`, `print`, `send`, `discover`), backed by **`@brother-ql/core`** registry data. The primary API is **`runCli`** for embedding or scripting; a standalone shell binary is not the focus of this package yet.

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **CLI overview:** [https://bankersman.github.io/brother-ql-node/cli/overview](https://bankersman.github.io/brother-ql-node/cli/overview)
- **Troubleshooting:** [https://bankersman.github.io/brother-ql-node/guide/troubleshooting](https://bankersman.github.io/brother-ql-node/guide/troubleshooting)

## Install

```bash
pnpm add @brother-ql/cli
```

From the monorepo: `pnpm install`, `pnpm build`.

## Usage

```typescript
import { runCli } from "@brother-ql/cli";

const { output, exitCode } = runCli(["info", "models"]);
console.log(output);
```

Configuration defaults are driven by environment variables (see the docs site).

## Related packages

- **`@brother-ql/core`** — models, labels, and command generation
- **`@brother-ql/node`** — Node printing client when you need programmatic I/O instead of CLI strings
