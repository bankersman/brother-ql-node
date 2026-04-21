# Supported printers and media

The lists below match the **model** and **label** registries shipped in `@brother-ql/core` (`packages/core/src/data/models.json` and `labels.json`). They are derived from the same upstream datasets as [Philipp Klaus’s brother_ql](https://github.com/pklaus/brother_ql) project. This documentation is for orientation only; Brother may ship hardware or media not reflected here.

::: tip Runtime list
Use the CLI [`info models` / `info labels`](../cli/overview.md) against your install to print the exact identifiers your build knows about.
:::

## Printer models

Identifiers are the strings you pass as `model` in the Node API or `BROTHER_QL_MODEL` for the CLI.

### Brother QL (90 bytes per raster row, 720-dot width class)

`QL-500`, `QL-550`, `QL-560`, `QL-570`, `QL-580N`, `QL-650TD`, `QL-700`, `QL-710W`, `QL-720NW`

### Brother QL with two-color (black / red) support

`QL-800`, `QL-810W`, `QL-820NWB` — use only with labels that support black/red/white when enabling two-color mode.

### Brother QL wide (162 bytes per row)

`QL-1050`, `QL-1060N`, `QL-1100`, `QL-1110NWB`, `QL-1115NWB`

### P-touch (different tape geometry; separate raster opcode in the protocol)

`PT-P750W`, `PT-P900W`

| Model | Bytes / row | Two-color |
| ----- | ----------- | --------- |
| QL-500 | 90 | no |
| QL-550 | 90 | no |
| QL-560 | 90 | no |
| QL-570 | 90 | no |
| QL-580N | 90 | no |
| QL-650TD | 90 | no |
| QL-700 | 90 | no |
| QL-710W | 90 | no |
| QL-720NW | 90 | no |
| QL-800 | 90 | yes |
| QL-810W | 90 | yes |
| QL-820NWB | 90 | yes |
| QL-1050 | 162 | no |
| QL-1060N | 162 | no |
| QL-1100 | 162 | no |
| QL-1110NWB | 162 | no |
| QL-1115NWB | 162 | no |
| PT-P750W | 16 | no |
| PT-P900W | 70 | no |

## Media (label) identifiers

Each **identifier** is the value you use as `label` in code or CLI. Sizes are **tape width × length in millimetres** where the registry stores them (endless tapes use `0` for length). **Color** reflects what the registry allows for thermal printing (`BLACK_RED_WHITE` is required for red channel on supported models).

| Identifier | Form factor | Size (mm) | Color | Only on these models |
| ---------- | ----------- | --------- | ----- | --------------------- |
| 12 | ENDLESS | 12 × ∞ | black / white | — |
| 29 | ENDLESS | 29 × ∞ | black / white | — |
| 38 | ENDLESS | 38 × ∞ | black / white | — |
| 50 | ENDLESS | 50 × ∞ | black / white | — |
| 54 | ENDLESS | 54 × ∞ | black / white | — |
| 62 | ENDLESS | 62 × ∞ | black / white | — |
| 62red | ENDLESS | 62 × ∞ | black / red / white | — |
| 102 | ENDLESS | 102 × ∞ | black / white | QL-1050, QL-1060N, QL-1100, QL-1110NWB, QL-1115NWB |
| 103 | ENDLESS | 104 × ∞ | black / white | QL-1050, QL-1060N, QL-1100, QL-1110NWB, QL-1115NWB |
| 17x54 | DIE_CUT | 17 × 54 | black / white | — |
| 17x87 | DIE_CUT | 17 × 87 | black / white | — |
| 23x23 | DIE_CUT | 23 × 23 | black / white | — |
| 29x42 | DIE_CUT | 29 × 42 | black / white | — |
| 29x90 | DIE_CUT | 29 × 90 | black / white | — |
| 39x90 | DIE_CUT | 38 × 90 | black / white | — |
| 39x48 | DIE_CUT | 39 × 48 | black / white | — |
| 52x29 | DIE_CUT | 52 × 29 | black / white | — |
| 60x86 | DIE_CUT | 60 × 87 | black / white | — |
| 62x29 | DIE_CUT | 62 × 29 | black / white | — |
| 62x100 | DIE_CUT | 62 × 100 | black / white | — |
| 102x51 | DIE_CUT | 102 × 51 | black / white | QL-1050, QL-1060N, QL-1100, QL-1110NWB, QL-1115NWB |
| 102x152 | DIE_CUT | 102 × 153 | black / white | QL-1050, QL-1060N, QL-1100, QL-1110NWB, QL-1115NWB |
| 103x164 | DIE_CUT | 104 × 164 | black / white | QL-1100, QL-1110NWB |
| d12 | ROUND_DIE_CUT | 12 Ø | black / white | — |
| d24 | ROUND_DIE_CUT | 24 Ø | black / white | — |
| d58 | ROUND_DIE_CUT | 58 Ø | black / white | — |
| pt24 | PTOUCH_ENDLESS | 24 × ∞ | black / white | — |

## Model and label rules

- Some labels are **restricted** to wide QL models only; the core library throws if you pair them with a narrow model.
- **Two-color** jobs require both a model with `two_color` support and a label marked for black/red printing (for example `62red`).
- Unknown `model` or `label` strings throw immediately so misconfiguration is caught before raster work is sent.

For integration examples, see [App integration](./app-integration.md). For upstream-oriented analysis of the registries, see the maintainer notes in the repository under `docs/analysis/models-and-labels.md`.
