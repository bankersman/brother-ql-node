# @brother-ql/node

**@brother-ql/node** is the main **Node.js SDK** for printing to Brother QL hardware over **TCP** (network, usually port `9100`) or **USB**. It composes **`@brother-ql/core`** (command generation and registries) with **`@brother-ql/transport-node`** (TCP/USB I/O).

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **App integration:** [https://bankersman.github.io/brother-ql-node/guide/app-integration](https://bankersman.github.io/brother-ql-node/guide/app-integration)
- **Printers and media:** [https://bankersman.github.io/brother-ql-node/guide/supported-hardware-and-media](https://bankersman.github.io/brother-ql-node/guide/supported-hardware-and-media)
- **Troubleshooting:** [https://bankersman.github.io/brother-ql-node/guide/troubleshooting](https://bankersman.github.io/brother-ql-node/guide/troubleshooting)

## Install

```bash
pnpm add @brother-ql/node
```

From the monorepo: clone, `pnpm install`, `pnpm build`.

## Usage

```typescript
import { BrotherQlNodeClient } from "@brother-ql/node";

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
```

## Related packages

- **`@brother-ql/core`** — protocol and model/label data
- **`@brother-ql/transport-node`** — low-level TCP and USB transports
