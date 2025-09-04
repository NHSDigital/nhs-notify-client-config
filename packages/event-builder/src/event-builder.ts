import { randomUUID } from "node:crypto";
import {
  $ClientMutatedEvent,
  ClientMutatedEvent,
} from "@nhsdigital/nhs-notify-config-schemas/src/schemas/client-mutated-event";
import { ClientInput } from "./input";
import { eventSource } from "./config";

export const buildEvent = (input: ClientInput): ClientMutatedEvent => {
  return $ClientMutatedEvent.parse({
    id: randomUUID(),
    datacontenttype: "application/json",
    time: new Date().toISOString(),
    specversion: "1.0",
    plane: "control",
    source: eventSource,
    subject: input.clientId,
    type: "uk.nhs.notify.config.ClientMutated.V1",
    dataschema:
      "https://notify.nhs.uk/events/schemas/client-mutated/1.0.0.json",
    dataschemaversion: "1.0.0",
    data: {
      id: input.clientId,
      name: input.clientName,
      apimApplication: {
        id: randomUUID(),
        apimId: input.apimId,
      },
      featureFlags: [],
      rfrCodes: [],
      suppressionFilters: [],
    },
  });
};
