import { afterEach, describe, expect, it, vi } from "vitest";

import { DirectSocketsTcpTransport } from "./direct-sockets-tcp-transport.js";

describe("DirectSocketsTcpTransport", () => {
  afterEach(() => {
    delete (globalThis as { TCPSocket?: unknown }).TCPSocket;
  });

  it("connect throws when TCPSocket is not on globalThis", async () => {
    const t = new DirectSocketsTcpTransport({ host: "127.0.0.1", port: 9100 });
    await expect(t.connect()).rejects.toThrow(
      "Direct Sockets TCPSocket is not available in this context."
    );
  });

  it("connect, write, read, and dispose with mocked TCPSocket", async () => {
    const written: Uint8Array[] = [];
    const toRead = new Uint8Array([9, 8, 7]);

    let readerReadCalls = 0;
    const readable = new ReadableStream<Uint8Array>({
      pull(controller) {
        readerReadCalls += 1;
        if (readerReadCalls === 1) {
          controller.enqueue(toRead);
        } else {
          controller.close();
        }
      }
    });

    const writable = new WritableStream<Uint8Array>({
      write(chunk) {
        written.push(new Uint8Array(chunk));
      }
    });

    const close = vi.fn(() => Promise.resolve());
    const opened = Promise.resolve({ readable, writable });

    class MockSocket {
      opened = opened;
      closed = Promise.resolve();
      close = close;
    }

    (globalThis as unknown as { TCPSocket: typeof MockSocket }).TCPSocket =
      MockSocket;

    const transport = new DirectSocketsTcpTransport({
      host: "192.168.1.50",
      port: 9100
    });
    await transport.connect();

    await transport.write({ data: new Uint8Array([1, 2, 3]), timeoutMs: 1000 });
    expect(written).toHaveLength(1);
    expect([...written[0]!]).toEqual([1, 2, 3]);

    const data = await transport.read({ size: 2, timeoutMs: 1000 });
    expect([...data]).toEqual([9, 8]);

    await transport.dispose();
    expect(close).toHaveBeenCalled();
  });

  it("write throws when not connected", async () => {
    const transport = new DirectSocketsTcpTransport({ host: "127.0.0.1" });
    await expect(
      transport.write({ data: new Uint8Array([1]) })
    ).rejects.toThrow("Transport is not connected.");
  });

  it("read returns empty when stream is done", async () => {
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.close();
      }
    });
    const writable = new WritableStream<Uint8Array>();

    class MockSocket {
      opened = Promise.resolve({ readable, writable });
      closed = Promise.resolve();
      close = vi.fn(() => Promise.resolve());
    }

    (globalThis as unknown as { TCPSocket: typeof MockSocket }).TCPSocket =
      MockSocket;

    const transport = new DirectSocketsTcpTransport({ host: "127.0.0.1" });
    await transport.connect();
    const out = await transport.read({ timeoutMs: 500 });
    expect(out.byteLength).toBe(0);
    await transport.dispose();
  });

  it("connect is idempotent", async () => {
    const readable = new ReadableStream<Uint8Array>({
      start(c) {
        c.close();
      }
    });
    const writable = new WritableStream<Uint8Array>();

    let instances = 0;
    class MockSocket {
      constructor() {
        instances += 1;
      }

      opened = Promise.resolve({ readable, writable });
      closed = Promise.resolve();
      close = vi.fn(() => Promise.resolve());
    }

    (globalThis as unknown as { TCPSocket: typeof MockSocket }).TCPSocket =
      MockSocket;

    const transport = new DirectSocketsTcpTransport({ host: "127.0.0.1" });
    await transport.connect();
    await transport.connect();
    expect(instances).toBe(1);
    await transport.dispose();
  });
});
