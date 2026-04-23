import {
  $CampaignDisabledEvent,
  $CampaignIntEvent,
  $CampaignProdEvent,
  CampaignEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/campaign-published-event";
import {
  $Campaign,
  Campaign,
} from "@nhsdigital/nhs-notify-events-client-config/src/domain";
import {
  buildEnvelope,
  filterScoped,
  schemaVersion,
} from "./event-builder-common";

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
 * Build the set of CloudEvents for a Campaign domain object.
 *
 * - DRAFT  → [] (no event published)
 * - INT    → [CampaignIntEvent]
 * - PROD   → [CampaignIntEvent (INT-scoped), CampaignProdEvent (PROD-scoped)]
 * - DISABLED → [CampaignDisabledEvent]
 */
export default function buildCampaignEvent(
  campaign: Campaign,
): CampaignEvent[] {
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
            "uk.nhs.notify.client-config.campaign.published.int.v1",
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
            "uk.nhs.notify.client-config.campaign.published.int.v1",
            `https://notify.nhs.uk/events/client-config/campaign-int-${schemaVersion}.json`,
            campaignForEnvironment(parsed, "INT"),
          ),
        ),
        $CampaignProdEvent.parse(
          buildEnvelope(
            parsed.id,
            "uk.nhs.notify.client-config.campaign.published.prod.v1",
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
