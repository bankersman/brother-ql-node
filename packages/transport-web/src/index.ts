export const WEB_TRANSPORT_PACKAGE_NAME = "@brother-ql/transport-web";

export {
  DirectSocketsTcpTransport,
  type DirectSocketsTcpOpenInfo,
  type DirectSocketsTcpSocket,
  type DirectSocketsTcpConstructor,
  type DirectSocketsTcpTransportOptions
} from "./direct-sockets-tcp-transport.js";
export {
  findPrinterBulkEndpoints,
  type PrinterBulkEndpoints
} from "./webusb-endpoints.js";
export {
  WebUsbTransport,
  type WebUsbTransportOptions
} from "./webusb-transport.js";
