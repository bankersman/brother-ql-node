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

  it("supports expanded parity option toggles", () => {
    const generated = generateBaselineCommand({
      model: "QL-820NWB",
      label: "62",
      imageBytes: new Uint8Array([1]),
      options: {
        highQuality: true,
        dither: true,
        threshold: 80,
        colorMode: "red-black"
      }
    });

    expect(Array.from(generated.bytes)).toEqual(
      expect.arrayContaining([
        0x69, 0x7a, 0x01, 0x69, 0x64, 0x01, 0x69, 0x74, 80
      ])
    );
  });

  it("fails on invalid threshold and missing identifiers", () => {
    expect(() =>
      generateBaselineCommand({
        model: "",
        label: "62",
        imageBytes: new Uint8Array(),
        options: {}
      })
    ).toThrow("Model is required.");

    expect(() =>
      generateBaselineCommand({
        model: "QL-710W",
        label: "",
        imageBytes: new Uint8Array(),
        options: {}
      })
    ).toThrow("Label is required.");

    expect(() =>
      generateBaselineCommand({
        model: "QL-710W",
        label: "62",
        imageBytes: new Uint8Array(),
        options: { threshold: 101 }
      })
    ).toThrow("Threshold must be between 0 and 100.");
  });
});
