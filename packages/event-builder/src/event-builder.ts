import { randomUUID } from "node:crypto";
import {
  $ClientChangedEvent,
  ClientChangedEvent,
} from "@nhsdigital/nhs-notify-client-config-schemas/src/schemas/client-changed-event";
import { ClientInput } from "./input";
import { eventSource } from "./config";

export const buildEvent = (input: ClientInput): ClientChangedEvent => {
  return $ClientChangedEvent.parse({
    id: randomUUID(),
    datacontenttype: "application/json",
    time: new Date().toISOString(),
    specversion: "1.0",
    plane: "control",
    source: eventSource,
    subject: input.clientId,
    type: "uk.nhs.notify.client-config.ClientChanged.v1",
    dataschema:
      "https://notify.nhs.uk/events/schemas/client-changed/1.0.0.json",
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
