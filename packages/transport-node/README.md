# @brother-ql/transport-node

**@brother-ql/transport-node** provides Node.js transports for Brother QL printers: **TCP** (typically port `9100`) and **USB** via the native [`usb`](https://www.npmjs.com/package/usb) package. It depends on **`@brother-ql/core`** for transport contracts and status semantics. Use it through **`@brother-ql/node`** unless you are wiring custom transport factories.

USB support requires a successful native build of `usb` on your OS and appropriate device permissions.

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **App integration (TCP/USB):** [https://bankersman.github.io/brother-ql-node/guide/app-integration](https://bankersman.github.io/brother-ql-node/guide/app-integration)
- **Printers and media:** [https://bankersman.github.io/brother-ql-node/guide/supported-hardware-and-media](https://bankersman.github.io/brother-ql-node/guide/supported-hardware-and-media)
- **Troubleshooting:** [https://bankersman.github.io/brother-ql-node/guide/troubleshooting](https://bankersman.github.io/brother-ql-node/guide/troubleshooting)

## Install

```bash
pnpm add @brother-ql/transport-node
```

From the monorepo root: `pnpm install` and `pnpm build`.

## Usage

Prefer the high-level client:

```typescript
import { BrotherQlNodeClient } from "@brother-ql/node";
```

Use this package directly when you supply custom `TcpTransport` / `UsbTransport` implementations to `BrotherQlNodeClient` options.

## Related packages

- **`@brother-ql/core`** — protocol and registry layer
- **`@brother-ql/node`** — `BrotherQlNodeClient` built on core + these transports
