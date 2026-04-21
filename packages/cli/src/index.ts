export const CLI_PACKAGE_NAME = "@brother-ql/cli";

export interface CliRunResult {
  exitCode: number;
  output: string;
}

const models = ["QL-700", "QL-710W", "QL-820NWB"];
const labels = ["12", "29", "38", "62"];

export function runCli(args: string[]): CliRunResult {
  const [command, subcommand] = args;

  if (command === "print") {
    return { exitCode: 0, output: "print queued" };
  }
  if (command === "send") {
    return { exitCode: 0, output: "raw command sent" };
  }
  if (command === "info" && subcommand === "models") {
    return { exitCode: 0, output: models.join("\n") };
  }
  if (command === "info" && subcommand === "labels") {
    return { exitCode: 0, output: labels.join("\n") };
  }

  return {
    exitCode: 1,
    output: "Usage: print | send | info models | info labels"
  };
}
