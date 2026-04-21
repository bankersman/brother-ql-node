import { describe, expect, it } from "vitest";

import { UsbTransport } from "./usb-transport.js";

describe("usb transport", () => {
  it("lists devices through adapter", async () => {
    const transport = new UsbTransport({
      listDevices: () =>
        Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }]),
      openDevice: () => Promise.resolve(),
      transferOut: () => Promise.resolve(),
      transferIn: () => Promise.resolve(new Uint8Array([1])),
      closeDevice: () => Promise.resolve()
    });

    const devices = await transport.listDevices();
    expect(devices).toHaveLength(1);
    expect(devices[0]?.vendorId).toBe(0x04f9);
  });

  it("performs connect write read dispose lifecycle", async () => {
    let openCalls = 0;
    let closeCalls = 0;
    const transport = new UsbTransport({
      listDevices: () =>
        Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }]),
      openDevice: () => {
        openCalls += 1;
        return Promise.resolve();
      },
      transferOut: () => Promise.resolve(),
      transferIn: () => Promise.resolve(new Uint8Array([0x10, 0x11])),
      closeDevice: () => {
        closeCalls += 1;
        return Promise.resolve();
      }
    });

    await transport.connect();
    await transport.write({ data: new Uint8Array([0x01]) });
    const response = await transport.read({ size: 2 });
    await transport.dispose();

    expect(openCalls).toBe(1);
    expect(closeCalls).toBe(1);
    expect(Array.from(response)).toEqual([0x10, 0x11]);
  });

  it("throws when no device is available", async () => {
    const transport = new UsbTransport({
      listDevices: () => Promise.resolve([]),
      openDevice: () => Promise.resolve(),
      transferOut: () => Promise.resolve(),
      transferIn: () => Promise.resolve(new Uint8Array()),
      closeDevice: () => Promise.resolve()
    });

    await expect(transport.connect()).rejects.toThrow("No USB printer device found.");
  });

  it("throws for read/write before connect", async () => {
    const transport = new UsbTransport({
      listDevices: () => Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }]),
      openDevice: () => Promise.resolve(),
      transferOut: () => Promise.resolve(),
      transferIn: () => Promise.resolve(new Uint8Array()),
      closeDevice: () => Promise.resolve()
    });

    await expect(transport.write({ data: new Uint8Array([1]) })).rejects.toThrow(
      "Transport is not connected."
    );
    await expect(transport.read()).rejects.toThrow("Transport is not connected.");
  });

  it("prefers explicitly targeted device", async () => {
    let opened: { vendorId: number; productId: number } | undefined;
    const transport = new UsbTransport(
      {
        listDevices: () =>
          Promise.resolve([
            { vendorId: 0x1234, productId: 0x0001 },
            { vendorId: 0x04f9, productId: 0x209b }
          ]),
        openDevice: (device) => {
          opened = device;
          return Promise.resolve();
        },
        transferOut: () => Promise.resolve(),
        transferIn: () => Promise.resolve(new Uint8Array()),
        closeDevice: () => Promise.resolve()
      },
      { vendorId: 0x1234, productId: 0x0001 }
    );

    await transport.connect();
    expect(opened).toEqual({ vendorId: 0x1234, productId: 0x0001 });
    await transport.dispose();
  });
});
