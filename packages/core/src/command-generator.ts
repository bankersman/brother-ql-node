import type { CommandBuffer, PrintOptions } from "./contracts.js";

export interface CommandGenerationRequest {
  model: string;
  label: string;
  imageBytes: Uint8Array;
  options?: PrintOptions;
}

export function generateBaselineCommand(
  request: CommandGenerationRequest
): CommandBuffer {
  const options = request.options ?? {};
  const chunks: number[] = [0x1b, 0x40]; // initialize

  if (options.compressRaster) {
    chunks.push(0x4d, 0x02);
  } else {
    chunks.push(0x4d, 0x00);
  }

  if (options.rotate180) {
    chunks.push(0x69, 0x41, 0x01);
  }

  chunks.push(0x69, 0x4d, options.cutAtEnd === false ? 0x00 : 0x40);

  // Minimal baseline payload marker for MVP. Real rasterization comes later.
  chunks.push(0x67, request.imageBytes.length > 0 ? 0x01 : 0x00);

  return {
    bytes: new Uint8Array(chunks)
  };
}
