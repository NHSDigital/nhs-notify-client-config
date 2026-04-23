import { randomUUID } from "node:crypto";
import {
  $ClientDisabledEvent,
  $ClientIntEvent,
  $ClientProdEvent,
  ClientEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/client-published-event";
import {
  $CampaignDisabledEvent,
  $CampaignIntEvent,
  $CampaignProdEvent,
  CampaignEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/campaign-published-event";
import {
  $Campaign,
  $Client,
  Campaign,
  Client,
} from "@nhsdigital/nhs-notify-events-client-config/src/domain";
import { Environment } from "@nhsdigital/nhs-notify-events-client-config/src/domain/common";
import schemaPackage from "@nhsdigital/nhs-notify-events-client-config/package.json";

const eventSource = "//notify.nhs.uk/app/nhs-notify-client-config-dev/main";
const schemaVersion = schemaPackage.version;

function buildEnvelope<T>(
  subject: string,
  type: string,
  dataschema: string,
  data: T,
) {
  return {
    id: randomUUID(),
    datacontenttype: "application/json",
    time: new Date().toISOString(),
    specversion: "1.0",
    plane: "control",
    source: eventSource,
    subject,
    type,
    dataschema,
    dataschemaversion: schemaVersion,
    data,
  };
}

/** Filter an optional environment-scoped array to only entries matching the target. */
function filterScoped<T extends { environment: Environment }>(
  items: T[] | undefined,
  target: Environment,
): T[] | undefined {
  if (!items) return undefined;
  const filtered = items.filter((i) => i.environment === target);
  return filtered.length > 0 ? filtered : undefined;
}

/**
 * Project a Client to a specific target environment status, filtering all
 * environment-scoped collections to only include entries for that environment.
 */
function clientForEnvironment(
  client: Client,
  target: "INT" | "PROD",
): Client {
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
 * Project a Campaign to a specific target environment status, filtering all
 * environment-scoped collections to only include entries for that environment.
 */
function campaignForEnvironment(
  campaign: Campaign,
  target: "INT" | "PROD",
): Campaign {
  return $Campaign.parse({
    ...campaign,
    status: target,
    govukNotifyConfigurations: filterScoped(
      campaign.govukNotifyConfigurations,
      target,
    ),
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
            "uk.nhs.notify.client-config.client.int.v1",
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
            "uk.nhs.notify.client-config.client.int.v1",
            `https://notify.nhs.uk/events/client-config/client-int-${schemaVersion}.json`,
            clientForEnvironment(parsed, "INT"),
          ),
        ),
        $ClientProdEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.client.prod.v1",
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

/**
 * Build the set of CloudEvents for a Campaign domain object.
 *
 * - DRAFT  → [] (no event published)
 * - INT    → [CampaignIntEvent]
 * - PROD   → [CampaignIntEvent (INT-scoped), CampaignProdEvent (PROD-scoped)]
 * - DISABLED → [CampaignDisabledEvent]
 */
export function buildCampaignEvent(campaign: Campaign): CampaignEvent[] {
  const parsed = $Campaign.parse(campaign);

  switch (parsed.status) {
    case "DRAFT": {
      return [];
    }
    case "INT": {
      return [
        $CampaignIntEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.campaign.int.v1",
            `https://notify.nhs.uk/events/client-config/campaign-int-${schemaVersion}.json`,
            campaignForEnvironment(parsed, "INT"),
          ),
        ),
      ];
    }
    case "PROD": {
      return [
        $CampaignIntEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.campaign.int.v1",
            `https://notify.nhs.uk/events/client-config/campaign-int-${schemaVersion}.json`,
            campaignForEnvironment(parsed, "INT"),
          ),
        ),
        $CampaignProdEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.campaign.prod.v1",
            `https://notify.nhs.uk/events/client-config/campaign-prod-${schemaVersion}.json`,
            campaignForEnvironment(parsed, "PROD"),
          ),
        ),
      ];
    }
    case "DISABLED": {
      return [
        $CampaignDisabledEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.campaign.disabled.v1",
            `https://notify.nhs.uk/events/client-config/campaign-disabled-${schemaVersion}.json`,
            parsed,
          ),
        ),
      ];
    }
    default: {
      throw new Error(`Unsupported campaign status: ${parsed.status}`);
    }
  }
}
