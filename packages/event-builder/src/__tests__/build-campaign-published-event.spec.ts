import {
  $CampaignIntEvent,
  $CampaignProdEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/campaign-published-event";
import buildCampaignEvent from "../campaign-event-builder";

describe("buildCampaignEvent", () => {
  const baseCampaign = {
    id: "campaign-123",
    clientId: "client-123",
    name: "Appointment Reminders",
    slug: "appointment-reminders",
    queues: [{ channel: "SMS" as const }],
    govukNotifyConfigurations: [
      {
        environment: "INT" as const,
        apiKeyParameterPath: "/nhs-notify/client-config/gun/int/api-key",
      },
      {
        environment: "PROD" as const,
        apiKeyParameterPath: "/nhs-notify/client-config/gun/prod/api-key",
      },
    ],
  };

  it("returns [] for a DRAFT campaign", () => {
    expect(
      buildCampaignEvent({ ...baseCampaign, status: "DRAFT" }),
    ).toHaveLength(0);
  });

  it("returns a single INT event for an INT-status campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "INT" });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(
      "uk.nhs.notify.client-config.campaign.published.int.v1",
    );
    expect(events[0].data.status).toBe("INT");
    expect(() => $CampaignIntEvent.parse(events[0])).not.toThrow();
  });

  it("returns INT + PROD pair for a PROD-status campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "PROD" });

    expect(events).toHaveLength(2);
    const [intEvent, prodEvent] = events;
    expect(intEvent.type).toBe(
      "uk.nhs.notify.client-config.campaign.published.int.v1",
    );
    expect(intEvent.data.status).toBe("INT");
    expect(prodEvent.type).toBe(
      "uk.nhs.notify.client-config.campaign.published.prod.v1",
    );
    expect(prodEvent.data.status).toBe("PROD");
  });

  it("PROD pair has correct env-scoped config filtering for campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "PROD" });
    const [intEvent, prodEvent] = events;

    expect(intEvent.data.govukNotifyConfigurations).toHaveLength(1);
    expect(intEvent.data.govukNotifyConfigurations![0].environment).toBe("INT");

    expect(prodEvent.data.govukNotifyConfigurations).toHaveLength(1);
    expect(prodEvent.data.govukNotifyConfigurations![0].environment).toBe(
      "PROD",
    );

    expect(() => $CampaignIntEvent.parse(intEvent)).not.toThrow();
    expect(() => $CampaignProdEvent.parse(prodEvent)).not.toThrow();
  });

  it("returns a single DISABLED event for a DISABLED-status campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "DISABLED" });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(
      "uk.nhs.notify.client-config.campaign.disabled.v1",
    );
  });
});
