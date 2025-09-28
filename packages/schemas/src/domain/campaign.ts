import { z } from "zod";
import { $Queue } from "./queue";
import { idRef } from "../helpers/id-ref";
import { $GovuknotifyAccount } from "./govuknotify-account";
import { $Client } from "./client";
import { $Environment, ConfigBase } from "./common";

export const $CampaignBase = ConfigBase("Campaign")
  .extend({
    name: z.string(),
    environment: $Environment,
    clientId: idRef($Client),
  })
  .meta({
    title: "CampaignBase",
    description: `Base schema for campaigns, defining identifying fields.
    Each campaign is associated with a single client.`,
  });

export const $Campaign = $CampaignBase
  .extend({
    default: z
      .boolean()
      .optional()
      .meta({
        title: "Default Campaign",
        description: `Indicates whether this campaign is the default for a client (i.e. not specific to a purpose).
      Each client can have only one default campaign per environment.
      It will be used for any messages sent without a specific campaign, such as those using global routing configurations.`,
      }),
    govuknotifyAccount: $GovuknotifyAccount.optional(),
    queues: z
      .array($Queue)
      .nonempty()
      .meta({
        description: `Each channel (e.g. email, sms) that this campaign will use to send messages has an associated queue.
    Each queue may also have associated throttling limits to control the rate of message dispatch.`,
      }),
  })
  .meta({
    title: "Campaign",
    description: `A campaign represents a discrete set of communications for a client.
    Messages sent as part of a campaign can be tracked and reported on together, and are isolated from each other for dispatch throttling purposes.
    For example, a client might have separate campaigns for appointment reminders, health check invitations, and test results.
    Each campaign is optionally associated with a single GOV.UK Notify account.`,
  });

export type Campaign = z.infer<typeof $Campaign>;
