/**
 * Locate the USB printer class (0x07) interface and bulk IN/OUT endpoints.
 * Mirrors discovery in upstream PyUSB backend.
 */
export interface PrinterBulkEndpoints {
  readonly configurationValue: number;
  readonly interfaceNumber: number;
  readonly outEndpointNumber: number;
  readonly inEndpointNumber: number;
}

export function findPrinterBulkEndpoints(
  device: USBDevice
): PrinterBulkEndpoints {
  const configs = device.configurations;
  if (!configs?.length) {
    throw new Error("USB device has no configurations.");
  }

  for (const cfg of configs) {
    for (const intf of cfg.interfaces) {
      for (const alt of intf.alternates) {
        if (alt.interfaceClass !== 7) {
          continue;
        }

        let outEndpointNumber: number | undefined;
        let inEndpointNumber: number | undefined;

        for (const ep of alt.endpoints) {
          if (ep.type !== "bulk") {
            continue;
          }
          if (ep.direction === "out") {
            outEndpointNumber = ep.endpointNumber;
          } else if (ep.direction === "in") {
            inEndpointNumber = ep.endpointNumber;
          }
        }

        if (outEndpointNumber !== undefined && inEndpointNumber !== undefined) {
          return {
            configurationValue: cfg.configurationValue,
            interfaceNumber: intf.interfaceNumber,
            outEndpointNumber,
            inEndpointNumber
          };
        }
      }
    }
  }

  throw new Error(
    "No USB printer class interface (class 7) with bulk IN and OUT endpoints was found."
  );
}
