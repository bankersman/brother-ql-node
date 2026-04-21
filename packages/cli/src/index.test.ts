import { describe, expect, it } from "vitest";

import { CLI_PACKAGE_NAME, runCli } from "./index.js";

describe("cli scaffold", () => {
  it("exposes package constant", () => {
    expect(CLI_PACKAGE_NAME).toBe("@brother-ql/cli");
  });

  it("supports v1 parity commands", () => {
    const runtime = {
      print: () => "printed",
      send: () => "sent",
      discover: () => "found-devices"
    };
    expect(runCli(["print"], { runtime }).output).toBe("printed");
    expect(runCli(["send"], { runtime }).output).toBe("sent");
    expect(runCli(["discover"], { runtime }).output).toBe("found-devices");
    expect(runCli(["info", "models"]).output).toContain("QL-710W");
    expect(runCli(["info", "labels"]).output).toContain("62");
    expect(
      runCli(["info", "env"], {
        env: {
          BROTHER_QL_BACKEND: "usb",
          BROTHER_QL_MODEL: "QL-820NWB",
          BROTHER_QL_PRINTER: "usb://0x04f9:0x209b"
        }
      }).output
    ).toContain("backend=usb");
    expect(runCli([]).exitCode).toBe(1);
  });
});
