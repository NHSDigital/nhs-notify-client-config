import { z } from "zod";
import { $Queue } from "./queue";
import { idRef } from "../helpers/id-ref";
import { $GovuknotifyAccount } from "./govuknotify-account";
import { $Client } from "./client";
import {
  $EnvironmentStatus,
  $Slug,
  ConfigBase,
  validateUniqueEnvironments,
  validateUniqueStringValues,
} from "./common";

export const $Campaign = ConfigBase("Campaign")
  .extend({
    name: z.string(),
    slug: $Slug.meta({
      title: "Campaign Slug",
      description:
        "Client-unique human-readable identifier used to distinguish campaigns for the same client.",
      examples: ["appointment-reminders"],
    }),
    status: $EnvironmentStatus,
    clientId: idRef($Client, undefined, "Client"),
    default: z
      .boolean()
      .optional()
      .meta({
        title: "Default Campaign",
        description: `Indicates whether this campaign is the default for a client (i.e. not specific to a purpose).
      Each client can have only one default campaign per environment.
      It will be used for any messages sent without a specific campaign, such as those using global routing configurations.`,
      }),
    govukNotifyConfigurations: z.array($GovuknotifyAccount).optional().meta({
      description:
        "Environment-scoped GOV.UK Notify account settings used by the campaign.",
    }),
    queues: z
      .array($Queue)
      .nonempty()
      .meta({
        description: `Each channel (e.g. email, sms) that this campaign will use to send messages has an associated queue.
    Each queue may also have associated throttling limits to control the rate of message dispatch.`,
      }),
  })
  .superRefine((campaign, ctx) => {
    validateUniqueStringValues(
      campaign.queues,
      ctx,
      "queues",
      ({ channel }) => channel,
      "channel",
    );

    if (campaign.govukNotifyConfigurations) {
      validateUniqueEnvironments(
        campaign.govukNotifyConfigurations,
        ctx,
        "govukNotifyConfigurations",
      );
    }
  })
  .meta({
    title: "Campaign",
    description: `A campaign represents a discrete set of communications for a client.
    Messages sent as part of a campaign can be tracked and reported on together, and are isolated from each other for dispatch throttling purposes.
    For example, a client might have separate campaigns for appointment reminders, health check invitations, and test results.
    Queue configuration is aggregated per channel, and GOV.UK Notify integration settings are embedded per environment.`,
  });

export type Campaign = z.infer<typeof $Campaign>;
