import { describe, expect, it, vi } from "vitest";

const fakeDevice = {
  deviceDescriptor: { idVendor: 0x04f9, idProduct: 0x209b },
  open: vi.fn(),
  close: vi.fn()
};

vi.mock("usb", () => ({
  getDeviceList: () => [fakeDevice]
}));

describe("node usb adapter", () => {
  it("lists opens transfers and closes devices", async () => {
    const { NodeUsbAdapter } = await import("./usb-transport.js");
    const adapter = new NodeUsbAdapter();

    const devices = await adapter.listDevices();
    expect(devices[0]).toEqual({ vendorId: 0x04f9, productId: 0x209b });

    await adapter.openDevice({ vendorId: 0x04f9, productId: 0x209b });
    expect(fakeDevice.open).toHaveBeenCalled();

    await expect(adapter.transferOut(new Uint8Array([1]))).resolves.toBeUndefined();
    await expect(adapter.transferIn(2)).resolves.toEqual(new Uint8Array(2));

    await adapter.closeDevice();
    expect(fakeDevice.close).toHaveBeenCalled();
  });

  it("throws when opening unknown usb device", async () => {
    const { NodeUsbAdapter } = await import("./usb-transport.js");
    const adapter = new NodeUsbAdapter();
    await expect(
      adapter.openDevice({ vendorId: 0x9999, productId: 0x0001 })
    ).rejects.toThrow("USB device not found");
  });
});
