import {
  $ClientDisabledEvent,
  $ClientIntEvent,
  $ClientProdEvent,
  ClientEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/client-published-event";
import {
  $Client,
  Client,
} from "@nhsdigital/nhs-notify-events-client-config/src/domain";
import {
  buildEnvelope,
  filterScoped,
  schemaVersion,
} from "./event-builder-common";

export { default as buildCampaignEvent } from "./campaign-event-builder";

/**
 * Project a Client to a specific target environment status, filtering all
 * environment-scoped collections to only include entries for that environment.
 */
function clientForEnvironment(client: Client, target: "INT" | "PROD"): Client {
  return $Client.parse({
    ...client,
    status: target,
    clientSubscriptions: filterScoped(client.clientSubscriptions, target),
    digitalLettersMeshMailboxes: filterScoped(
      client.digitalLettersMeshMailboxes,
      target,
    ),
    messageRequestsApimApplications: filterScoped(
      client.messageRequestsApimApplications,
      target,
    ),
    messageRequestsMeshMailboxes: filterScoped(
      client.messageRequestsMeshMailboxes,
      target,
    ),
    // globalQueues are not environment-scoped — pass through as-is
  });
}

/**
 * Build the set of CloudEvents for a Client domain object.
 *
 * - DRAFT  → [] (no event published)
 * - INT    → [ClientIntEvent]
 * - PROD   → [ClientIntEvent (INT-scoped), ClientProdEvent (PROD-scoped)]
 * - DISABLED → [ClientDisabledEvent]
 */
export function buildClientEvent(client: Client): ClientEvent[] {
  const parsed = $Client.parse(client);

  switch (parsed.status) {
    case "DRAFT": {
      return [];
    }
    case "INT": {
      return [
        $ClientIntEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.client.published.int.v1",
            `https://notify.nhs.uk/events/client-config/client-int-${schemaVersion}.json`,
            clientForEnvironment(parsed, "INT"),
          ),
        ),
      ];
    }
    case "PROD": {
      return [
        $ClientIntEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.client.published.int.v1",
            `https://notify.nhs.uk/events/client-config/client-int-${schemaVersion}.json`,
            clientForEnvironment(parsed, "INT"),
          ),
        ),
        $ClientProdEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.client.published.prod.v1",
            `https://notify.nhs.uk/events/client-config/client-prod-${schemaVersion}.json`,
            clientForEnvironment(parsed, "PROD"),
          ),
        ),
      ];
    }
    case "DISABLED": {
      return [
        $ClientDisabledEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.client.disabled.v1",
            `https://notify.nhs.uk/events/client-config/client-disabled-${schemaVersion}.json`,
            parsed,
          ),
        ),
      ];
    }
    default: {
      throw new Error(`Unsupported client status: ${parsed.status}`);
    }
  }
}
