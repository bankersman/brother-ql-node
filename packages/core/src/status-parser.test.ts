import { describe, expect, it } from "vitest";

import { parseStatusFrame } from "./status-parser.js";

describe("status parser", () => {
  it("parses completed frame with no errors", () => {
    const parsed = parseStatusFrame(new Uint8Array([2, 0, 0, 0]));
    expect(parsed.phaseType).toBe("completed");
    expect(parsed.statusType).toBe("ok");
    expect(parsed.errors).toHaveLength(0);
  });

  it("extracts mapped errors from bitfield", () => {
    const parsed = parseStatusFrame(new Uint8Array([255, 3, 0x07, 0]));
    expect(parsed.phaseType).toBe("error");
    expect(parsed.errors).toEqual(
      expect.arrayContaining(["cover-open", "media-empty", "cutter-jam"])
    );
  });
});
