import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { generateBaselineCommand } from "./command-generator.js";
import { bytesToHex, loadGoldenFixtures } from "./golden.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(
  __dirname,
  "../../../spec/upstream/golden-commands"
);

describe("command generation MVP", () => {
  it("matches representative fixture baseline prefix", async () => {
    const fixtures = await loadGoldenFixtures(fixturesDir);
    const fixture = fixtures[0];
    expect(fixture).toBeDefined();
    if (!fixture) {
      return;
    }

    const generated = generateBaselineCommand({
      model: fixture.model,
      label: fixture.label,
      imageBytes: new Uint8Array([1, 2, 3]),
      options: {
        cutAtEnd: true,
        compressRaster: false
      }
    });

    expect(
      bytesToHex(generated.bytes).startsWith(fixture.instruction_hex)
    ).toBe(true);
  });
});
