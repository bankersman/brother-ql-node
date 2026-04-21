import { describe, expect, it } from "vitest";

import { BrotherQlNodeClient } from "./index.js";
import { UsbTransport } from "../../transport-node/src/index.js";

describe("node sdk api", () => {
  it("constructs usb client and executes print path", async () => {
    const client = new BrotherQlNodeClient({
      backend: "usb",
      transportFactory: {
        createUsbTransport: () =>
          new UsbTransport({
            listDevices: () =>
              Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }]),
            openDevice: () => Promise.resolve(),
            transferOut: () => Promise.resolve(),
            transferIn: () => Promise.resolve(new Uint8Array()),
            closeDevice: () => Promise.resolve()
          }),
        createTcpTransport: () => {
          throw new Error("Not expected in USB test.");
        }
      }
    });
    const response = await client.print({
      model: "QL-820NWB",
      label: "62",
      imageBytes: new Uint8Array([1])
    });

    expect(response.ok).toBe(true);
    expect(response.backend).toBe("usb");
  });
});
