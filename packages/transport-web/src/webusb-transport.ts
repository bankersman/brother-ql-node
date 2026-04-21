import type {
  RuntimeTransport,
  TransportReadRequest,
  TransportWriteRequest
} from "@brother-ql/core";

import {
  findPrinterBulkEndpoints,
  type PrinterBulkEndpoints
} from "./webusb-endpoints.js";

const DEFAULT_FILTERS: USBDeviceFilter[] = [{ vendorId: 0x04f9 }];

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    void promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
  });
}

function getNavigatorUsb():
  | { requestDevice(input: { filters: USBDeviceFilter[] }): Promise<USBDevice> }
  | undefined {
  const nav = globalThis.navigator as Navigator | undefined;
  return nav?.usb;
}

export interface WebUsbTransportOptions {
  /** If set, `connect()` uses this device instead of calling `requestDevice`. */
  readonly device?: USBDevice;
  /** Passed to `navigator.usb.requestDevice` when `device` is not set. */
  readonly filters?: USBDeviceFilter[];
}

export class WebUsbTransport implements RuntimeTransport {
  readonly kind = "webusb" as const;

  private readonly filters: USBDeviceFilter[];
  private readonly presetDevice: USBDevice | undefined;

  private device: USBDevice | undefined;
  private endpoints: PrinterBulkEndpoints | undefined;
  private interfaceClaimed = false;

  constructor(options?: WebUsbTransportOptions) {
    this.presetDevice = options?.device;
    this.filters = options?.filters ?? DEFAULT_FILTERS;
  }

  /**
   * Prompt for a Brother (or filtered) USB device. Requires a secure context and user gesture.
   */
  static async requestDevice(
    filters: USBDeviceFilter[] = DEFAULT_FILTERS
  ): Promise<USBDevice> {
    const usb = getNavigatorUsb();
    if (!usb) {
      throw new Error("WebUSB is not available in this browser.");
    }
    return usb.requestDevice({ filters });
  }

  async connect(): Promise<void> {
    if (this.device && this.endpoints && this.interfaceClaimed) {
      return;
    }

    let device: USBDevice;
    if (this.presetDevice) {
      device = this.presetDevice;
    } else {
      const usb = getNavigatorUsb();
      if (!usb) {
        throw new Error("WebUSB is not available in this browser.");
      }
      device = await usb.requestDevice({ filters: this.filters });
    }

    await device.open();

    const endpoints = findPrinterBulkEndpoints(device);
    await device.selectConfiguration(endpoints.configurationValue);
    await device.claimInterface(endpoints.interfaceNumber);

    this.device = device;
    this.endpoints = endpoints;
    this.interfaceClaimed = true;
  }

  async write(request: TransportWriteRequest): Promise<void> {
    if (!this.device || !this.endpoints) {
      throw new Error("Transport is not connected.");
    }

    const timeoutMs = request.timeoutMs ?? 15_000;
    await withTimeout(
      this.device.transferOut(
        this.endpoints.outEndpointNumber,
        request.data as BufferSource
      ),
      timeoutMs,
      "WebUSB transferOut timed out."
    );
  }

  async read(request?: TransportReadRequest): Promise<Uint8Array> {
    if (!this.device || !this.endpoints) {
      throw new Error("Transport is not connected.");
    }

    const timeoutMs = request?.timeoutMs ?? 2000;
    const packetSize = request?.size ?? 512;

    const result = await withTimeout<USBInTransferResult>(
      this.device.transferIn(this.endpoints.inEndpointNumber, packetSize),
      timeoutMs,
      "WebUSB transferIn timed out."
    );

    if (!result.data || result.data.byteLength === 0) {
      return new Uint8Array(0);
    }

    return new Uint8Array(
      result.data.buffer,
      result.data.byteOffset,
      result.data.byteLength
    );
  }

  async dispose(): Promise<void> {
    const device = this.device;
    const endpoints = this.endpoints;
    this.device = undefined;
    this.endpoints = undefined;
    this.interfaceClaimed = false;

    if (!device || !endpoints) {
      return;
    }

    try {
      await device.releaseInterface(endpoints.interfaceNumber);
    } catch {
      // ignore release errors during teardown
    }

    try {
      await device.close();
    } catch {
      // ignore close errors
    }
  }
}
