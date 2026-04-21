import { sendBlocking } from "@brother-ql/core/blocking-send";
import { generateBaselineCommand } from "@brother-ql/core/command-generator";
import {
  DirectSocketsTcpTransport,
  WebUsbTransport
} from "@brother-ql/transport-web";

const logEl = document.getElementById("log");

function log(...args: unknown[]): void {
  const line = args
    .map((a) => (a instanceof Error ? `${a.name}: ${a.message}` : String(a)))
    .join(" ");
  if (logEl) {
    logEl.textContent += `${line}\n`;
  }
}

function getModelLabel(): { model: string; label: string } {
  const model = (document.getElementById("model") as HTMLInputElement).value;
  const label = (document.getElementById("label") as HTMLInputElement).value;
  return { model, label };
}

async function getImageBytes(): Promise<Uint8Array> {
  const input = document.getElementById("image") as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return new Uint8Array([200]);
  }
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

let webUsbTransport: WebUsbTransport | undefined;
let tcpTransport: DirectSocketsTcpTransport | undefined;

async function onWebUsbConnect(): Promise<void> {
  try {
    webUsbTransport = new WebUsbTransport();
    await webUsbTransport.connect();
    log("WebUSB connected.");
  } catch (error: unknown) {
    log(error);
  }
}

async function onWebUsbPrint(): Promise<void> {
  if (!webUsbTransport) {
    log("Connect WebUSB first.");
    return;
  }
  try {
    const { model, label } = getModelLabel();
    const imageBytes = await getImageBytes();
    const command = generateBaselineCommand({ model, label, imageBytes });
    const result = await sendBlocking({
      transport: webUsbTransport,
      payload: command.bytes,
      timeoutMs: 30_000
    });
    log("sendBlocking (webusb):", JSON.stringify(result));
  } catch (error: unknown) {
    log(error);
  }
}

async function onTcpConnect(): Promise<void> {
  try {
    const host = (document.getElementById("tcp-host") as HTMLInputElement)
      .value;
    const port = Number(
      (document.getElementById("tcp-port") as HTMLInputElement).value
    );
    tcpTransport = new DirectSocketsTcpTransport({ host, port });
    await tcpTransport.connect();
    log("TCP connected (Direct Sockets).");
  } catch (error: unknown) {
    log(error);
  }
}

async function onTcpPrint(): Promise<void> {
  if (!tcpTransport) {
    log("Connect TCP first.");
    return;
  }
  try {
    const { model, label } = getModelLabel();
    const imageBytes = await getImageBytes();
    const command = generateBaselineCommand({ model, label, imageBytes });
    const result = await sendBlocking({
      transport: tcpTransport,
      payload: command.bytes,
      timeoutMs: 15_000
    });
    log("sendBlocking (tcp):", JSON.stringify(result));
  } catch (error: unknown) {
    log(error);
  }
}

document.getElementById("webusb-connect")?.addEventListener("click", () => {
  void onWebUsbConnect();
});

document.getElementById("webusb-print")?.addEventListener("click", () => {
  void onWebUsbPrint();
});

document.getElementById("tcp-connect")?.addEventListener("click", () => {
  void onTcpConnect();
});

document.getElementById("tcp-print")?.addEventListener("click", () => {
  void onTcpPrint();
});

const hasTcp =
  typeof (globalThis as unknown as { TCPSocket?: unknown }).TCPSocket ===
  "function";
log(
  `TCPSocket (Direct Sockets) available: ${hasTcp ? "yes" : "no — use an IWA or allowed origin"}`
);
