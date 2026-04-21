import { describe, expect, it } from "vitest";

import { BrotherQlNodeClient } from "./index.js";

describe("node sdk api", () => {
  it("constructs usb client and executes print path", async () => {
    const client = new BrotherQlNodeClient({ backend: "usb" });
    const response = await client.print({
      model: "QL-820NWB",
      label: "62",
      imageBytes: new Uint8Array([1])
    });

    expect(response.ok).toBe(true);
    expect(response.backend).toBe("usb");
  });
});
