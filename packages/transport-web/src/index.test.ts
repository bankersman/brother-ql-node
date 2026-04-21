import { describe, expect, it } from "vitest";

import { WEB_TRANSPORT_PACKAGE_NAME } from "./index.js";

describe("web transport scaffold", () => {
  it("exposes package constant", () => {
    expect(WEB_TRANSPORT_PACKAGE_NAME).toBe("@brother-ql/transport-web");
  });
});
