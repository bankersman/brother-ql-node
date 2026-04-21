# @brother-ql/transport-web

**@brother-ql/transport-web** provides **low-level browser** [`RuntimeTransport`](https://github.com/bankersman/brother-ql-node/blob/main/packages/core/src/contracts.ts) implementations for **WebUSB** and optional **Direct Sockets** TCP (`TCPSocket`). For application code, prefer **[`@brother-ql/web`](https://github.com/bankersman/brother-ql-node/tree/main/packages/web)** — it mirrors the Node SDK shape (`BrotherQlWebClient`) and handles WebUSB session lifecycle. Use this package when you need direct control over transports. Parity and documentation depth are lighter here than for the Node stack (`@brother-ql/node` / `@brother-ql/transport-node`).

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **App integration (Node-focused, useful context):** [https://bankersman.github.io/brother-ql-node/guide/app-integration](https://bankersman.github.io/brother-ql-node/guide/app-integration)
- **Contributing:** [https://bankersman.github.io/brother-ql-node/contributing](https://bankersman.github.io/brother-ql-node/contributing)

## Install

```bash
pnpm add @brother-ql/transport-web
```

From the monorepo: `pnpm install`, `pnpm build`.

## WebUSB (`WebUsbTransport`)

- Discovers the USB **printer class** interface (class `7`) and bulk IN/OUT endpoints (same idea as the PyUSB backend in upstream `brother_ql`).
- Default device filter: Brother `vendorId: 0x04f9`. Override via `filters`, or pass a pre-selected `USBDevice` if you already called `navigator.usb.requestDevice`.
- Requires a **secure context** (HTTPS or `http://localhost`) and a **user gesture** for device selection when not using a preset device.

```typescript
import { sendBlocking } from "@brother-ql/core/blocking-send";
import { generateBaselineCommand } from "@brother-ql/core/command-generator";
import { WebUsbTransport } from "@brother-ql/transport-web";

const transport = new WebUsbTransport();
await transport.connect();

const command = generateBaselineCommand({
  model: "QL-820NWB",
  label: "62",
  imageBytes: rasterBytes
});

const result = await sendBlocking({
  transport,
  payload: command.bytes,
  timeoutMs: 30_000
});

await transport.dispose();
```

Use subpath imports from `@brother-ql/core` in bundlers so **Node-only** modules (for example `golden`) are not pulled into the browser bundle.

## Experimental TCP (`DirectSocketsTcpTransport`)

Chrome’s **Direct Sockets** API exposes `TCPSocket` for raw TCP. It is **not** available on typical HTTPS sites; it is aimed at **Isolated Web Apps**, enterprise-allowed origins, and similar controlled contexts. See [Direct Sockets (IWA)](https://developer.chrome.com/docs/iwa/direct-sockets).

`DirectSocketsTcpTransport` uses `globalThis.TCPSocket` when present and implements `kind: "network"`. [`sendBlocking`](https://github.com/bankersman/brother-ql-node/blob/main/packages/core/src/blocking-send.ts) treats network transports as **send-only / ambiguous completion**, consistent with the Node TCP backend.

## Demo (monorepo)

The Vite demo lives under **`packages/web/demo`** (`@brother-ql/web-demo`) and depends on **`@brother-ql/web`**. Run from the repo root:

```bash
pnpm --filter @brother-ql/web-demo dev
```

Then open the printed local URL (default port `5173`). The demo exercises WebUSB and, when `TCPSocket` exists, Direct Sockets TCP.

Production build of the demo (also runs as part of `pnpm build`):

```bash
pnpm --filter @brother-ql/web-demo build
```

The documentation site build embeds that bundle; see root **`pnpm docs:build`** and **`build:web-demo-for-docs`**.

## Related packages

- **`@brother-ql/core`** — protocol, command generation, blocking send
- **`@brother-ql/web`** — high-level browser client (recommended for apps)
- **`@brother-ql/node`** — production-oriented printing on Node.js
- **`@brother-ql/transport-node`** — Node TCP/USB transports
