import { describe, expect, it } from "vitest";

import { CLI_PACKAGE_NAME, runCli } from "./index.js";

describe("cli scaffold", () => {
  it("exposes package constant", () => {
    expect(CLI_PACKAGE_NAME).toBe("@brother-ql/cli");
  });

  it("supports v1 parity commands", () => {
    expect(runCli(["print"]).exitCode).toBe(0);
    expect(runCli(["send"]).exitCode).toBe(0);
    expect(runCli(["info", "models"]).output).toContain("QL-710W");
    expect(runCli(["info", "labels"]).output).toContain("62");
    expect(runCli([]).exitCode).toBe(1);
  });
});
