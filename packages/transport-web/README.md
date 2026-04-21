# @brother-ql/transport-web

**@brother-ql/transport-web** is an **experimental browser-side** helper built around the **WebUSB** API. It is meant for exploration and future browser workflows; parity and documentation depth are lighter here than for the Node stack (`@brother-ql/node` / `@brother-ql/transport-node`).

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **App integration (Node-focused, useful context):** [https://bankersman.github.io/brother-ql-node/guide/app-integration](https://bankersman.github.io/brother-ql-node/guide/app-integration)
- **Contributing:** [https://bankersman.github.io/brother-ql-node/contributing](https://bankersman.github.io/brother-ql-node/contributing)

## Install

```bash
pnpm add @brother-ql/transport-web
```

From the monorepo: `pnpm install`, `pnpm build`.

## Usage

```typescript
import { WebUsbTransport } from "@brother-ql/transport-web";

const transport = new WebUsbTransport();
await transport.requestDevice();
```

WebUSB requires a **secure context** (HTTPS or localhost) and a browser that exposes `navigator.usb`.

## Related packages

- **`@brother-ql/core`** — shared protocol types and logic (Node-oriented today)
- **`@brother-ql/node`** — production-oriented printing on Node.js
