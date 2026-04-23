import { $Campaign } from "../campaign";

describe("Campaign validations", () => {
  const validCampaign = {
    clientId: "00f3b388-bbe9-41c9-9e76-052d37ee8988",
    id: "c6456f1f-10db-4cc4-9b3e-8d43993b506c",
    name: "Appointment Reminders",
    queues: [
      {
        channel: "LETTER",
      },
    ],
    slug: "appointment-reminders",
    status: "INT",
  };

  it("accepts a campaign with a slug", () => {
    expect(() => $Campaign.parse(validCampaign)).not.toThrow();
  });

  it("rejects a campaign without a slug", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, ...campaignWithoutSlug } = validCampaign;

    expect(() => $Campaign.parse(campaignWithoutSlug)).toThrow();
  });
});
