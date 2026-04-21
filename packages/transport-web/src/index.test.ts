import { describe, expect, it } from "vitest";

import { WEB_TRANSPORT_PACKAGE_NAME, WebUsbTransport } from "./index.js";

describe("transport-web package", () => {
  it("exposes package constant", () => {
    expect(WEB_TRANSPORT_PACKAGE_NAME).toBe("@brother-ql/transport-web");
  });

  it("static requestDevice throws when WebUSB is unavailable", async () => {
    await expect(WebUsbTransport.requestDevice()).rejects.toThrow(
      "WebUSB is not available in this browser."
    );
  });
});
