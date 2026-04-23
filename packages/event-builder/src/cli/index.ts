/* eslint-disable unicorn/no-process-exit */

import fs from "node:fs";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import {
  $Client,
  Client,
} from "@nhsdigital/nhs-notify-events-client-config/src/domain";
import { buildClientEvent } from "../event-builder";
import sendSQSBatchMessages from "../send-event-to-queue";

type PrintFormat = "json" | "table";
type PrintFunction = (value: unknown) => void;

function getPrinter(format: PrintFormat): PrintFunction {
  if (format === "json") {
    return (value) => console.log(JSON.stringify(value, null, 2));
  }

  return (value) => console.table(Array.isArray(value) ? value : [value]);
}

function readClientsFromJson(jsonFile: string): Client[] {
  const raw: unknown = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const items = Array.isArray(raw) ? raw : [raw];

  return items.map((item, index) => {
    const result = $Client.safeParse(item);

    if (!result.success) {
      throw new Error(
        `Invalid client at index ${index}: ${result.error.message}`,
      );
    }

    return result.data;
  });
}

async function main() {
  let print: PrintFunction;
  let queueEnvironment: string;

  function setGlobals(argv: { format: string; environment: string }) {
    print = getPrinter(argv.format as PrintFormat);
    queueEnvironment = argv.environment;
  }

  await yargs(hideBin(process.argv))
    .option("environment", {
      type: "string",
      description: "Queue environment to send events to (e.g. de2-aiyu1, int)",
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
      "publish-clients",
      "Reads Client JSON and publishes the appropriate configuration events to the queue",
      {
        "json-file": {
          type: "string",
          description:
            "Path to a JSON file containing a Client object or array of Client objects",
          demandOption: true,
        },
      },
      async (argv) => {
        try {
          const clients = readClientsFromJson(argv.jsonFile);

          const events = clients.flatMap((client) => buildClientEvent(client));

          if (events.length === 0) {
            print("No events to publish (all clients are DRAFT status)");
            return;
          }

          await sendSQSBatchMessages(events, queueEnvironment);
          print(`${events.length} event(s) successfully sent to queue`);
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
