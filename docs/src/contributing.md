# Contributing

Thanks for helping improve `brother-ql-node`.

## Local quality gate

Run this from repository root before opening a pull request:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Docs workflow

```bash
pnpm docs:dev
pnpm docs:build
```

## Credits

This project rebuilds Brother QL workflows in TypeScript with strong respect for the original Python implementation and ecosystem work in [`pklaus/brother_ql`](https://github.com/pklaus/brother_ql).
