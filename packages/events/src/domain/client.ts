import { z } from "zod";
import { $ApimApplication } from "./apim-application";
import {
  $DigitalLettersMeshMailbox,
  $MessageRequestsMeshMailbox,
} from "./mesh-mailbox";
import { $SuppressionFilter } from "./suppression-filter";
import { $ClientQuota } from "./client-quota";
import {
  $EnvironmentStatus,
  $Slug,
  ConfigBase,
  validateUniqueEnvironments,
  validateUniqueStringValues,
} from "./common";
import { $FeatureFlag } from "./feature-flag";
import { idRef } from "../helpers/id-ref";
import rfrCoding from "./rfr-coding";
import { $ClientSubscription } from "./client-subscription";
import { $Queue } from "./queue";

export const $Client = ConfigBase("Client")
  .extend({
    name: z.string(),
    slug: $Slug.meta({
      title: "Client Slug",
      description:
        "Human-readable identifier for the client, used alongside the UUID client ID.",
      examples: ["test-client"],
    }),
    status: $EnvironmentStatus,
    senderOdsCode: z.string().optional(),
    pdsQuota: $ClientQuota.optional(),
    messageRequestsMeshMailboxes: z
      .array($MessageRequestsMeshMailbox)
      .optional()
      .meta({
        description:
          "Environment-scoped MESH mailbox settings for message request workflows.",
      }),
    digitalLettersMeshMailboxes: z
      .array($DigitalLettersMeshMailbox)
      .optional()
      .meta({
        description:
          "Environment-scoped Digital Letters MESH mailbox settings.",
      }),
    messageRequestsApimApplications: z.array($ApimApplication).optional().meta({
      description:
        "Environment-scoped APIM application identifiers for message request traffic.",
    }),
    clientSubscriptions: z.array($ClientSubscription).optional().meta({
      description:
        "Environment-scoped callback subscription settings for the client.",
    }),
    globalQueues: z.array($Queue).nonempty().optional().meta({
      description:
        "Queues configured directly on the client for global routing scenarios that are not tied to a campaign.",
    }),

    featureFlags: z.array(idRef($FeatureFlag)).optional(),
    rfrCodes: z
      .array(z.enum(Object.keys(rfrCoding)))
      .optional()
      .meta({
        title: "Reason for Removal Codes",
        description: `Reason for removal codes (RFR codes) indicate
why a recipient has been removed from their GP's registered patient list.

This field is optional, but if provided must be an array of valid codes. The default behaviour is to suppress communications to
recipients with any RFR code, but this option can be used to allow recipients with certain codes to receive communications.

See https://data.developer.nhs.uk/dms/mim/6.3.01/Vocabulary/NHAISRemovalReasonCode.htm for information on possible codes.

PDS currently only provides a subset of 'Exit' codes, including those for Deceased patients.
* DEA - Death
* EMB - Embarkation
* SCT - Transferred to Scotland
* NIT - Transferred to Northern Ireland
* TRA - Temporary resident not returned
* ORR - Other reason
`,
      }),
    suppressionFilters: z.array($SuppressionFilter).optional(),
  })
  .superRefine((client, ctx) => {
    if (client.messageRequestsMeshMailboxes) {
      validateUniqueEnvironments(
        client.messageRequestsMeshMailboxes,
        ctx,
        "messageRequestsMeshMailboxes",
      );
    }

    if (client.digitalLettersMeshMailboxes) {
      validateUniqueEnvironments(
        client.digitalLettersMeshMailboxes,
        ctx,
        "digitalLettersMeshMailboxes",
      );
    }

    if (client.messageRequestsApimApplications) {
      validateUniqueEnvironments(
        client.messageRequestsApimApplications,
        ctx,
        "messageRequestsApimApplications",
      );
    }

    if (client.clientSubscriptions) {
      validateUniqueEnvironments(
        client.clientSubscriptions,
        ctx,
        "clientSubscriptions",
      );
    }

    if (client.globalQueues) {
      validateUniqueStringValues(
        client.globalQueues,
        ctx,
        "globalQueues",
        ({ channel }) => channel,
        "channel",
      );
    }
  })
  .meta({
    title: "Client",
    description: `A client represents an organisation or service that sends communications.
    Client records are promoted through DRAFT, INT, PROD, and DISABLED states, while environment-specific operational settings and global routing queues are embedded as child configuration collections.`,
  });

export const $ClientId = $Client.shape.id;
export type Client = z.infer<typeof $Client>;
