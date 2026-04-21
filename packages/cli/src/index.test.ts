import { describe, expect, it } from "vitest";

import { CLI_PACKAGE_NAME } from "./index.js";

describe("cli scaffold", () => {
  it("exposes package constant", () => {
    expect(CLI_PACKAGE_NAME).toBe("@brother-ql/cli");
  });
});
