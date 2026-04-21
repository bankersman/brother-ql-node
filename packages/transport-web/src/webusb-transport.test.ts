import { afterEach, describe, expect, it, vi } from "vitest";

import { WebUsbTransport } from "./webusb-transport.js";

function bulkOut(n: number): USBEndpoint {
  return { endpointNumber: n, direction: "out", type: "bulk", packetSize: 512 };
}
function bulkIn(n: number): USBEndpoint {
  return { endpointNumber: n, direction: "in", type: "bulk", packetSize: 512 };
}

function createMockUsbDevice(): {
  device: USBDevice;
  calls: {
    open: unknown[];
    selectConfiguration: unknown[];
    claimInterface: unknown[];
    transferOut: unknown[];
    transferIn: unknown[];
    releaseInterface: unknown[];
    close: unknown[];
  };
} {
  const calls = {
    open: [] as unknown[],
    selectConfiguration: [] as unknown[],
    claimInterface: [] as unknown[],
    transferOut: [] as unknown[],
    transferIn: [] as unknown[],
    releaseInterface: [] as unknown[],
    close: [] as unknown[]
  };

  const device = {
    configurations: [
      {
        configurationValue: 1,
        interfaces: [
          {
            interfaceNumber: 0,
            alternates: [
              {
                interfaceClass: 7,
                endpoints: [bulkOut(2), bulkIn(1)]
              }
            ]
          }
        ]
      }
    ],
    open: vi.fn(() => {
      calls.open.push(true);
      return Promise.resolve();
    }),
    selectConfiguration: vi.fn((v: number) => {
      calls.selectConfiguration.push(v);
      return Promise.resolve();
    }),
    claimInterface: vi.fn((n: number) => {
      calls.claimInterface.push(n);
      return Promise.resolve();
    }),
    transferOut: vi.fn((endpointNumber: number, data: BufferSource) => {
      calls.transferOut.push({ endpointNumber, data });
      return Promise.resolve({
        bytesWritten: (data as ArrayBufferView).byteLength,
        status: "ok" as const
      });
    }),
    transferIn: vi.fn((endpointNumber: number, length: number) => {
      calls.transferIn.push({ endpointNumber, length });
      const buf = new ArrayBuffer(2);
      const view = new DataView(buf);
      view.setUint8(0, 0);
      view.setUint8(1, 0);
      return Promise.resolve({
        data: new DataView(buf),
        status: "ok" as const
      });
    }),
    releaseInterface: vi.fn((n: number) => {
      calls.releaseInterface.push(n);
      return Promise.resolve();
    }),
    close: vi.fn(() => {
      calls.close.push(true);
      return Promise.resolve();
    })
  } as unknown as USBDevice;

  return { device, calls };
}

describe("WebUsbTransport", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { navigator?: Navigator }).navigator;
  });

  it("static requestDevice throws when WebUSB is unavailable", async () => {
    await expect(WebUsbTransport.requestDevice()).rejects.toThrow(
      "WebUSB is not available in this browser."
    );
  });

  it("connect throws when WebUSB is unavailable", async () => {
    const transport = new WebUsbTransport();
    await expect(transport.connect()).rejects.toThrow(
      "WebUSB is not available in this browser."
    );
  });

  it("connect uses preset device and claims printer interface", async () => {
    const { device, calls } = createMockUsbDevice();
    const transport = new WebUsbTransport({ device });

    await transport.connect();

    expect(calls.open).toHaveLength(1);
    expect(calls.selectConfiguration).toEqual([1]);
    expect(calls.claimInterface).toEqual([0]);
  });

  it("write uses bulk OUT endpoint", async () => {
    const { device } = createMockUsbDevice();
    const transport = new WebUsbTransport({ device });
    await transport.connect();

    const payload = new Uint8Array([1, 2, 3]);
    await transport.write({ data: payload, timeoutMs: 5000 });

    const dev = device as unknown as {
      transferOut: ReturnType<typeof vi.fn>;
    };
    expect(dev.transferOut).toHaveBeenCalledWith(2, expect.any(Object));
  });

  it("read uses bulk IN endpoint and returns bytes", async () => {
    const { device } = createMockUsbDevice();
    const transport = new WebUsbTransport({ device });
    await transport.connect();

    const out = await transport.read({ size: 64, timeoutMs: 1000 });
    expect(out.byteLength).toBe(2);

    const dev = device as unknown as {
      transferIn: ReturnType<typeof vi.fn>;
    };
    expect(dev.transferIn).toHaveBeenCalledWith(1, 64);
  });

  it("write throws when not connected", async () => {
    const transport = new WebUsbTransport();
    await expect(
      transport.write({ data: new Uint8Array([1]) })
    ).rejects.toThrow("Transport is not connected.");
  });

  it("dispose releases interface and closes device", async () => {
    const { device, calls } = createMockUsbDevice();
    const transport = new WebUsbTransport({ device });
    await transport.connect();
    await transport.dispose();

    expect(calls.releaseInterface).toEqual([0]);
    expect(calls.close).toHaveLength(1);
  });

  it("connect is idempotent after first success", async () => {
    const { device, calls } = createMockUsbDevice();
    const transport = new WebUsbTransport({ device });
    await transport.connect();
    await transport.connect();
    expect(calls.open).toHaveLength(1);
  });
});
