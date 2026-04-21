import { describe, expect, it } from "vitest";

import {
  applyGeometryRules,
  normalizeRgbaImage,
  toMonoRaster,
  toTwoColorRaster
} from "./image-pipeline.js";

function solidRgba(
  width: number,
  height: number,
  r: number,
  g: number,
  b: number,
  a = 255
): Uint8Array {
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const idx = i * 4;
    rgba[idx] = r;
    rgba[idx + 1] = g;
    rgba[idx + 2] = b;
    rgba[idx + 3] = a;
  }
  return rgba;
}

describe("image pipeline", () => {
  it("composites alpha over white", () => {
    const normalized = normalizeRgbaImage({
      width: 1,
      height: 1,
      rgba: new Uint8Array([0, 0, 0, 0])
    });
    expect(Array.from(normalized.rgba)).toEqual([255, 255, 255, 255]);
  });

  it("applies endless geometry resizing and 600dpi width halving", () => {
    const image = {
      width: 200,
      height: 100,
      rgba: solidRgba(200, 100, 10, 10, 10)
    };
    const transformed = applyGeometryRules(image, {
      model: "QL-710W",
      label: "62",
      dpi600: true
    });
    expect(transformed.width).toBe(696);
  });

  it("converts to mono bits and two-color masks", () => {
    const image = {
      width: 2,
      height: 1,
      rgba: new Uint8Array([255, 0, 0, 255, 10, 10, 10, 255])
    };

    const mono = toMonoRaster(image, { thresholdPercent: 70 });
    expect(Array.from(mono.bits)).toEqual([1, 1]);

    const twoColor = toTwoColorRaster(image);
    expect(Array.from(twoColor.redBits)).toEqual([1, 0]);
    expect(Array.from(twoColor.blackBits)).toEqual([0, 1]);
  });

  it("handles rotate=0 passthrough and die-cut auto-rotate swap", () => {
    const passthrough = applyGeometryRules(
      { width: 306, height: 425, rgba: solidRgba(306, 425, 0, 0, 0) },
      { model: "QL-710W", label: "29x42", rotate: 0 }
    );
    expect(passthrough.width).toBe(306);
    expect(passthrough.height).toBe(425);

    const swapped = applyGeometryRules(
      { width: 425, height: 306, rgba: solidRgba(425, 306, 0, 0, 0) },
      { model: "QL-710W", label: "29x42", rotate: "auto" }
    );
    expect(swapped.width).toBe(306);
    expect(swapped.height).toBe(425);
  });

  it("rejects invalid die-cut dimensions", () => {
    expect(() =>
      applyGeometryRules(
        { width: 10, height: 10, rgba: solidRgba(10, 10, 0, 0, 0) },
        { model: "QL-710W", label: "29x42", rotate: "auto" }
      )
    ).toThrow("do not match die-cut label 29x42");
  });

  it("covers mono non-dither branch and non-red two-color branch", () => {
    const image = {
      width: 2,
      height: 1,
      rgba: new Uint8Array([220, 220, 220, 255, 200, 100, 100, 255])
    };
    const mono = toMonoRaster(image, { thresholdPercent: 50, dither: false });
    expect(Array.from(mono.bits)).toEqual([0, 0]);

    const twoColor = toTwoColorRaster(image);
    expect(Array.from(twoColor.redBits)).toEqual([0, 1]);
  });
});
