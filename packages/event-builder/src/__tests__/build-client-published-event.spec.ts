import { $CampaignIntEvent, $CampaignProdEvent } from "@nhsdigital/nhs-notify-events-client-config/src/events/campaign-published-event";
import {
  $ClientIntEvent,
  $ClientProdEvent,
} from "@nhsdigital/nhs-notify-events-client-config/src/events/client-published-event";
import schemaPackage from "@nhsdigital/nhs-notify-events-client-config/package.json";
import { buildCampaignEvent, buildClientEvent } from "../event-builder";

const schemaVersion = schemaPackage.version;

describe("buildClientEvent", () => {
  const baseClient = {
    id: "client-123",
    name: "Test Client",
    slug: "test-client",
    messageRequestsApimApplications: [
      { environment: "INT" as const, applicationId: "apim-int" },
      { environment: "PROD" as const, applicationId: "apim-prod" },
    ],
    clientSubscriptions: [
      {
        environment: "INT" as const,
        callbackUrl: "https://example.nhs.uk/int/callback",
        messageStatuses: ["enriched" as const],
      },
      {
        environment: "PROD" as const,
        callbackUrl: "https://example.nhs.uk/prod/callback",
        messageStatuses: ["enriched" as const],
      },
    ],
  };

  it("returns [] for a DRAFT client", () => {
    const events = buildClientEvent({
      ...baseClient,
      status: "DRAFT",
    });

    expect(events).toHaveLength(0);
  });

  it("returns a single INT event for an INT-status client", () => {
    const events = buildClientEvent({ ...baseClient, status: "INT" });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("uk.nhs.notify.client-config.client.int.v1");
    expect(events[0].data.status).toBe("INT");
    expect(events[0].dataschema).toMatch(
      new RegExp(`client-int-${schemaVersion}\\.json$`),
    );
    expect(() => $ClientIntEvent.parse(events[0])).not.toThrow();
  });

  it("INT event only contains INT-scoped config entries", () => {
    const events = buildClientEvent({ ...baseClient, status: "INT" });

    const intEvent = events[0];
    expect(
      intEvent.data.messageRequestsApimApplications?.every(
        (a) => a.environment === "INT",
      ),
    ).toBe(true);
    expect(
      intEvent.data.clientSubscriptions?.every(
        (s) => s.environment === "INT",
      ),
    ).toBe(true);
  });

  it("returns INT + PROD pair for a PROD-status client", () => {
    const events = buildClientEvent({ ...baseClient, status: "PROD" });

    expect(events).toHaveLength(2);

    const [intEvent, prodEvent] = events;
    expect(intEvent.type).toBe("uk.nhs.notify.client-config.client.int.v1");
    expect(intEvent.data.status).toBe("INT");
    expect(prodEvent.type).toBe("uk.nhs.notify.client-config.client.prod.v1");
    expect(prodEvent.data.status).toBe("PROD");
  });

  it("PROD pair has correct env-scoped config filtering", () => {
    const events = buildClientEvent({ ...baseClient, status: "PROD" });
    const [intEvent, prodEvent] = events;

    // INT event only has INT entries
    expect(intEvent.data.messageRequestsApimApplications).toHaveLength(1);
    expect(intEvent.data.messageRequestsApimApplications![0].environment).toBe("INT");
    expect(intEvent.data.messageRequestsApimApplications![0].applicationId).toBe("apim-int");

    // PROD event only has PROD entries
    expect(prodEvent.data.messageRequestsApimApplications).toHaveLength(1);
    expect(prodEvent.data.messageRequestsApimApplications![0].environment).toBe("PROD");
    expect(prodEvent.data.messageRequestsApimApplications![0].applicationId).toBe("apim-prod");

    expect(() => $ClientIntEvent.parse(intEvent)).not.toThrow();
    expect(() => $ClientProdEvent.parse(prodEvent)).not.toThrow();
  });

  it("returns a single DISABLED event for a DISABLED-status client", () => {
    const events = buildClientEvent({ ...baseClient, status: "DISABLED" });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(
      "uk.nhs.notify.client-config.client.disabled.v1",
    );
  });

  it("uses the schema package version in the event dataschema", () => {
    const events = buildClientEvent({ ...baseClient, status: "INT" });

    expect(events[0].dataschemaversion).toEqual(schemaVersion);
  });
});

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
        apiKeyParameterPath:
          "/nhs-notify/client-config/gun/int/api-key",
      },
      {
        environment: "PROD" as const,
        apiKeyParameterPath:
          "/nhs-notify/client-config/gun/prod/api-key",
      },
    ],
  };

  it("returns [] for a DRAFT campaign", () => {
    expect(buildCampaignEvent({ ...baseCampaign, status: "DRAFT" })).toHaveLength(0);
  });

  it("returns a single INT event for an INT-status campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "INT" });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("uk.nhs.notify.client-config.campaign.int.v1");
    expect(events[0].data.status).toBe("INT");
    expect(() => $CampaignIntEvent.parse(events[0])).not.toThrow();
  });

  it("returns INT + PROD pair for a PROD-status campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "PROD" });

    expect(events).toHaveLength(2);
    const [intEvent, prodEvent] = events;
    expect(intEvent.type).toBe("uk.nhs.notify.client-config.campaign.int.v1");
    expect(intEvent.data.status).toBe("INT");
    expect(prodEvent.type).toBe(
      "uk.nhs.notify.client-config.campaign.prod.v1",
    );
    expect(prodEvent.data.status).toBe("PROD");
  });

  it("PROD pair has correct env-scoped config filtering for campaign", () => {
    const events = buildCampaignEvent({ ...baseCampaign, status: "PROD" });
    const [intEvent, prodEvent] = events;

    expect(intEvent.data.govukNotifyConfigurations).toHaveLength(1);
    expect(intEvent.data.govukNotifyConfigurations![0].environment).toBe("INT");

    expect(prodEvent.data.govukNotifyConfigurations).toHaveLength(1);
    expect(prodEvent.data.govukNotifyConfigurations![0].environment).toBe("PROD");

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
