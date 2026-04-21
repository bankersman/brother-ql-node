import { defineConfig } from "vitepress";

function resolveBase() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) {
    return "/";
  }

  const [, name] = repo.split("/");
  if (!name) {
    return "/";
  }

  return `/${name}/`;
}

export default defineConfig({
  title: "brother-ql-node",
  description: "User docs for Brother QL printing from Node.js",
  srcDir: "src",
  base: resolveBase(),
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/app-integration" },
      { text: "CLI", link: "/cli/overview" },
      { text: "Reference", link: "/reference/analysis-notes" },
      {
        text: "Upstream",
        link: "https://github.com/pklaus/brother_ql"
      }
    ],
    sidebar: [
      {
        text: "Welcome",
        items: [{ text: "Start here", link: "/" }]
      },
      {
        text: "Guide",
        items: [
          { text: "App integration", link: "/guide/app-integration" },
          { text: "Troubleshooting", link: "/guide/troubleshooting" }
        ]
      },
      {
        text: "CLI",
        items: [{ text: "CLI usage", link: "/cli/overview" }]
      },
      {
        text: "Contributing",
        items: [{ text: "Contributing", link: "/contributing" }]
      },
      {
        text: "Reference",
        items: [{ text: "Analysis notes", link: "/reference/analysis-notes" }]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/pklaus/brother_ql" }
    ]
  }
});
