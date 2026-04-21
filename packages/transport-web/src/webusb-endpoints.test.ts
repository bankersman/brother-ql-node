import { describe, expect, it } from "vitest";

import { findPrinterBulkEndpoints } from "./webusb-endpoints.js";

function bulkOut(endpointNumber: number): USBEndpoint {
  return {
    endpointNumber,
    direction: "out",
    type: "bulk",
    packetSize: 512
  };
}

function bulkIn(endpointNumber: number): USBEndpoint {
  return {
    endpointNumber,
    direction: "in",
    type: "bulk",
    packetSize: 512
  };
}

function mockDeviceWithPrinterInterface(
  overrides?: Partial<{ outNum: number; inNum: number }>
): USBDevice {
  const outNum = overrides?.outNum ?? 2;
  const inNum = overrides?.inNum ?? 1;
  return {
    configurations: [
      {
        configurationValue: 1,
        interfaces: [
          {
            interfaceNumber: 0,
            alternates: [
              {
                interfaceClass: 7,
                endpoints: [bulkOut(outNum), bulkIn(inNum)]
              }
            ]
          }
        ]
      }
    ]
  } as unknown as USBDevice;
}

describe("findPrinterBulkEndpoints", () => {
  it("returns configuration, interface, and bulk endpoint numbers", () => {
    const device = mockDeviceWithPrinterInterface({ outNum: 3, inNum: 4 });
    const result = findPrinterBulkEndpoints(device);
    expect(result).toEqual({
      configurationValue: 1,
      interfaceNumber: 0,
      outEndpointNumber: 3,
      inEndpointNumber: 4
    });
  });

  it("throws when device has no configurations", () => {
    const device = { configurations: [] } as unknown as USBDevice;
    expect(() => findPrinterBulkEndpoints(device)).toThrow(
      "USB device has no configurations."
    );
  });

  it("throws when printer class bulk pair is missing", () => {
    const device = {
      configurations: [
        {
          configurationValue: 1,
          interfaces: [
            {
              interfaceNumber: 0,
              alternates: [
                {
                  interfaceClass: 8,
                  endpoints: [bulkOut(1), bulkIn(2)]
                }
              ]
            }
          ]
        }
      ]
    } as unknown as USBDevice;
    expect(() => findPrinterBulkEndpoints(device)).toThrow(
      "No USB printer class interface (class 7) with bulk IN and OUT endpoints was found."
    );
  });

  it("throws when bulk IN is missing", () => {
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
                  endpoints: [bulkOut(1)]
                }
              ]
            }
          ]
        }
      ]
    } as unknown as USBDevice;
    expect(() => findPrinterBulkEndpoints(device)).toThrow(
      "No USB printer class interface (class 7) with bulk IN and OUT endpoints was found."
    );
  });
});
