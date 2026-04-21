---
layout: home

hero:
  name: brother-ql-node
  text: Brother QL printing from Node.js
  tagline: TypeScript workspace for TCP and USB workflows, informed by the upstream brother_ql protocol and registry work.
  actions:
    - theme: brand
      text: App integration
      link: /guide/app-integration
    - theme: alt
      text: Supported printers & media
      link: /guide/supported-hardware-and-media
    - theme: alt
      text: Repository
      link: https://github.com/bankersman/brother_ql_node

features:
  - title: Typed models and media
    details: Printer and label identifiers come from the same datasets as upstream brother_ql, so invalid model and label pairs are rejected before you print.
    link: /guide/supported-hardware-and-media
    linkText: View supported hardware
  - title: TCP and USB transports
    details: High-level APIs build on transports suited for servers and desktop tooling, with practical notes for USB permissions and network printers.
    link: /guide/app-integration
    linkText: Integrate in your app
  - title: CLI surface
    details: Commands aligned with common brother_ql workflows for inspection, sending, and scripting.
    link: /cli/overview
    linkText: CLI usage

footer: |
  <p><strong>Acknowledgements</strong> — This project is not affiliated with Brother Industries. It is a community TypeScript reimplementation with parity goals.</p>
  <p>Deep thanks to <strong>Philipp Klaus</strong> for <a href="https://github.com/pklaus/brother_ql" target="_blank" rel="noreferrer">brother_ql</a>: protocol groundwork, model and label registries, and long-running maintenance that made this port possible.</p>
---
