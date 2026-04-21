import { describe, expect, it } from "vitest";

import { WEB_TRANSPORT_PACKAGE_NAME, WebUsbTransport } from "./index.js";

describe("web transport scaffold", () => {
  it("exposes package constant", () => {
    expect(WEB_TRANSPORT_PACKAGE_NAME).toBe("@brother-ql/transport-web");
  });

  it("documents WebUSB availability constraints", async () => {
    const transport = new WebUsbTransport();
    await expect(transport.requestDevice()).rejects.toThrow(
      "WebUSB is not available in this browser."
    );
  });
});
