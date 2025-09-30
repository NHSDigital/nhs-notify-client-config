import { randomUUID } from "node:crypto";
import {
  $ClientPublishedEvent,
  ClientPublishedEvent,
} from "@nhsdigital/nhs-notify-client-config-schemas/src/events/client-published-event";
import { $ClientId } from "@nhsdigital/nhs-notify-client-config-schemas/src/domain/client";
import schemaPackage from "@nhsdigital/nhs-notify-client-config-schemas/package.json";
import { ClientInput } from "./input";
import { eventSource } from "./config";

const schemaVersion = schemaPackage.version;

const buildEvent = (input: ClientInput): ClientPublishedEvent => {
  return $ClientPublishedEvent.parse({
    id: randomUUID(),
    datacontenttype: "application/json",
    time: new Date().toISOString(),
    specversion: "1.0",
    plane: "control",
    source: eventSource,
    subject: input.clientId,
    type: "uk.nhs.notify.client-config.client-published.v1",
    dataschema: `https://notify.nhs.uk/events/client-config/client-published-${schemaVersion}.json`,
    dataschemaversion: schemaVersion,
    data: {
      id: $ClientId.parse(input.clientId),
      name: input.clientName,
      environment: input.environment,
      apimApplication: {
        id: randomUUID(),
        apimId: input.apimId,
      },
      featureFlags: [],
      rfrCodes: [],
      suppressionFilters: [],
    },
  } satisfies ClientPublishedEvent);
};

export default buildEvent;
