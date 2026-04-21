import { describe, expect, it } from "vitest";

import { CORE_PACKAGE_NAME } from "./index.js";

describe("core package scaffold", () => {
  it("exposes package constant", () => {
    expect(CORE_PACKAGE_NAME).toBe("@brother-ql/core");
  });
});
