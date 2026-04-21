export const WEB_TRANSPORT_PACKAGE_NAME = "@brother-ql/transport-web";

export class WebUsbTransport {
  async requestDevice(
    filters: Array<{ vendorId?: number; productId?: number }> = []
  ) {
    const nav = globalThis.navigator as
      | {
          usb?: {
            requestDevice(input: { filters: unknown[] }): Promise<unknown>;
          };
        }
      | undefined;
    if (!nav?.usb) {
      throw new Error("WebUSB is not available in this browser.");
    }
    return nav.usb.requestDevice({ filters });
  }
}
