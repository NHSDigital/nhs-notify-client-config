/* eslint-disable unicorn/no-process-exit */

import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { ClientPublishedEvent } from "@nhsdigital/nhs-notify-client-config-schemas/src/events/client-published-event";
import convertCSV from "../csv-to-client-input";
import buildEvent from "../event-builder";
import sendSQSBatchMessages from "../send-event-to-queue";

type PrintFormat = "json" | "table";
type PrintFunction = (value: unknown) => void;

function getPrinter(format: PrintFormat): PrintFunction {
  if (format === "json") {
    return (value) => console.log(JSON.stringify(value, null, 2));
  }

  return (value) => console.table(Array.isArray(value) ? value : [value]);
}

async function main() {
  let print: PrintFunction;
  let env: string;

  function setGlobals(argv: { format: string; environment: string }) {
    print = getPrinter(argv.format as PrintFormat);
    env = argv.environment;
  }

  await yargs(hideBin(process.argv))
    .option("environment", {
      type: "string",
      global: true,
      demandOption: true,
    })
    .option("format", {
      type: "string",
      choices: ["json", "table"],
      default: "json",
      global: true,
      demandOption: false,
    })
    .middleware(setGlobals)
    .command(
      "create-client",
      "generates the client mutated event and saved onto a queue",
      {
        "csv-file": {
          type: "string",
          demandOption: true,
        },
      },
      async (argv) => {
        const results: ClientPublishedEvent[] = [];

        try {
          const clientsDetails = convertCSV(argv.csvFile, env);

          for (const client of clientsDetails) {
            const event = buildEvent(client);
            results.push(event);
          }

          sendSQSBatchMessages(results, env).then(() => {
            print("Event(s) successfully sent to queue");
          });
        } catch (error) {
          console.error((error as Error).message);
          process.exit(1);
        }
      },
    )
    .demandCommand(1)
    .fail((msg, err) => {
      const e = err ?? new Error(msg);
      console.error(e.message);
      process.exit(1);
    })
    .parseAsync();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
