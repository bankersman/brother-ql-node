import type { StatusFrame } from "./contracts.js";

export interface ParsedStatusFrame extends StatusFrame {
  errors: string[];
}

const STATUS_OK = 0x00;
const STATUS_COVER_OPEN = 0x01;
const STATUS_MEDIA_EMPTY = 0x02;
const STATUS_ERROR = 0x03;

export function parseStatusFrame(raw: Uint8Array): ParsedStatusFrame {
  if (raw.length < 4) {
    throw new Error("Invalid status frame: too short.");
  }

  const phase = raw[0]!;
  const status = raw[1]!;
  const errorByte = raw[2]!;

  const errors: string[] = [];
  if (errorByte & 0x01) errors.push("cover-open");
  if (errorByte & 0x02) errors.push("media-empty");
  if (errorByte & 0x04) errors.push("cutter-jam");

  const frame: ParsedStatusFrame = {
    phaseType:
      phase === 2
        ? "completed"
        : phase === 1
          ? "printing"
          : phase === 255
            ? "error"
            : "waiting",
    statusType:
      status === STATUS_OK
        ? "ok"
        : status === STATUS_COVER_OPEN
          ? "cover-open"
          : status === STATUS_MEDIA_EMPTY
            ? "media-empty"
            : status === STATUS_ERROR
              ? "generic-error"
              : "generic-error",
    raw,
    errors
  };
  if (errorByte !== 0) {
    frame.errorCode = errorByte;
  }
  return frame;
}
