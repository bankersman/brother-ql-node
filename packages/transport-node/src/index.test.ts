import { describe, expect, it } from "vitest";

import { NODE_TRANSPORT_PACKAGE_NAME } from "./index.js";

describe("node transport scaffold", () => {
  it("exposes package constant", () => {
    expect(NODE_TRANSPORT_PACKAGE_NAME).toBe("@brother-ql/transport-node");
  });
});
