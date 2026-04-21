# Troubleshooting

## Environment checks

- Confirm Node.js `>=24`.
- Run `pnpm install` at the workspace root.
- Run `pnpm lint && pnpm format:check && pnpm typecheck && pnpm test` before publishing changes.

## TCP issues

- `TCP connect timed out.` usually means host/port is unreachable.
- Verify printer IP, network route, and that port `9100` is open.
- Start with a direct local-network test before adding timeouts or retries in app code.

## USB issues

- `No USB printer device found.` means no detectable USB device was selected.
- `USB device not found: ...` means the selected vendor/product pair was not found.
- On Linux, ensure your user has USB access (udev rules or equivalent).

## Validation errors

- `Unknown model: ...` or `Unknown label: ...` means the identifier is not in the current registry.
- Label restriction errors indicate the selected label cannot be used by that model.
- Two-color errors indicate a red-capable label was selected on a model without two-color support.

## Ambiguous completion for network send

For network transport, blocking send currently returns sent/ambiguous semantics rather than a confirmed completion state.

Plan your app flow around this by tracking printer-side output or introducing your own retry/observation strategy.
