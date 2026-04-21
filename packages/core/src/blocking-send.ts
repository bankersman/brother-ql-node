import type { RuntimeTransport, StatusFrame } from "./contracts.js";
import { parseStatusFrame } from "./status-parser.js";

export interface BlockingSendRequest {
  transport: RuntimeTransport;
  payload: Uint8Array;
  timeoutMs: number;
  pollIntervalMs?: number;
}

export interface BlockingSendResult {
  completed: boolean;
  ambiguous: boolean;
  sent: boolean;
  finalStatus: StatusFrame | undefined;
}

export async function sendBlocking(
  request: BlockingSendRequest
): Promise<BlockingSendResult> {
  const pollIntervalMs = request.pollIntervalMs ?? 20;
  const start = Date.now();

  await request.transport.connect();
  await request.transport.write({
    data: request.payload,
    timeoutMs: request.timeoutMs
  });
  if (request.transport.kind === "network") {
    return {
      completed: false,
      ambiguous: true,
      sent: true,
      finalStatus: undefined
    };
  }

  let lastStatus: StatusFrame | undefined;
  while (Date.now() - start < request.timeoutMs) {
    const raw = await request.transport.read({ timeoutMs: pollIntervalMs });
    lastStatus = decodeStatusFrame(raw);

    if (
      lastStatus.phaseType === "completed" &&
      lastStatus.statusType === "ok"
    ) {
      return {
        completed: true,
        ambiguous: false,
        sent: true,
        finalStatus: lastStatus
      };
    }
    if (lastStatus.phaseType === "error") {
      return {
        completed: false,
        ambiguous: false,
        sent: true,
        finalStatus: lastStatus
      };
    }
  }

  return {
    completed: false,
    ambiguous: true,
    sent: true,
    finalStatus: lastStatus
  };
}

export function decodeStatusFrame(raw: Uint8Array): StatusFrame {
  return parseStatusFrame(raw);
}
