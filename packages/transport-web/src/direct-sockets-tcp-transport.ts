import type {
  RuntimeTransport,
  TransportReadRequest,
  TransportWriteRequest
} from "@brother-ql/core";

/** Minimal surface for Chrome Direct Sockets `TCPSocket` (WICG). */
export interface DirectSocketsTcpOpenInfo {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

export interface DirectSocketsTcpSocket {
  readonly opened: Promise<DirectSocketsTcpOpenInfo>;
  readonly closed: Promise<void>;
  close(): Promise<void>;
}

export interface DirectSocketsTcpConstructor {
  new (
    remoteAddress: string,
    remotePort: number,
    options?: Record<string, unknown>
  ): DirectSocketsTcpSocket;
}

function getTcpSocketConstructor(): DirectSocketsTcpConstructor | undefined {
  return (globalThis as unknown as { TCPSocket?: DirectSocketsTcpConstructor })
    .TCPSocket;
}

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

export interface DirectSocketsTcpTransportOptions {
  host: string;
  port?: number;
  connectTimeoutMs?: number;
}

/**
 * Experimental: raw TCP via Chrome **Direct Sockets** (`TCPSocket`).
 * Typically only available in **Isolated Web Apps** or other restricted contexts,
 * not on ordinary HTTPS pages.
 */
export class DirectSocketsTcpTransport implements RuntimeTransport {
  readonly kind = "network" as const;

  private readonly options: Required<DirectSocketsTcpTransportOptions>;
  private socket: DirectSocketsTcpSocket | undefined;
  private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  private writer: WritableStreamDefaultWriter<Uint8Array> | undefined;

  constructor(options: DirectSocketsTcpTransportOptions) {
    this.options = {
      host: options.host,
      port: options.port ?? 9100,
      connectTimeoutMs: options.connectTimeoutMs ?? 5000
    };
  }

  async connect(): Promise<void> {
    if (this.socket) {
      return;
    }

    const SocketCtor = getTcpSocketConstructor();
    if (!SocketCtor) {
      throw new Error(
        "Direct Sockets TCPSocket is not available in this context. It is usually limited to Isolated Web Apps or enterprise-allowed origins, not normal web pages."
      );
    }

    const socket = new SocketCtor(this.options.host, this.options.port, {});

    const { readable, writable } = await withTimeout(
      socket.opened,
      this.options.connectTimeoutMs,
      "TCP connect timed out."
    );

    this.socket = socket;
    this.reader = readable.getReader();
    this.writer = writable.getWriter();
  }

  async write(request: TransportWriteRequest): Promise<void> {
    if (!this.writer) {
      throw new Error("Transport is not connected.");
    }

    const timeoutMs = request.timeoutMs ?? 2000;
    await withTimeout(
      this.writer.write(request.data),
      timeoutMs,
      "TCP write timed out."
    );
  }

  async read(request?: TransportReadRequest): Promise<Uint8Array> {
    if (!this.reader) {
      throw new Error("Transport is not connected.");
    }

    const timeoutMs = request?.timeoutMs ?? 2000;
    const maxSize = request?.size;

    const result = await withTimeout(
      this.reader.read(),
      timeoutMs,
      "TCP read timed out."
    );

    if (result.done || !result.value) {
      return new Uint8Array(0);
    }

    const chunk = result.value;
    if (maxSize !== undefined && chunk.byteLength > maxSize) {
      return chunk.subarray(0, maxSize);
    }

    return chunk;
  }

  async dispose(): Promise<void> {
    const reader = this.reader;
    const writer = this.writer;
    const socket = this.socket;
    this.reader = undefined;
    this.writer = undefined;
    this.socket = undefined;

    try {
      await reader?.cancel();
    } catch {
      // ignore
    }

    try {
      await writer?.close();
    } catch {
      // ignore
    }

    if (socket) {
      try {
        await socket.close();
      } catch {
        // ignore
      }
    }
  }
}
