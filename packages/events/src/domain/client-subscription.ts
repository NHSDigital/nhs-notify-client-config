import { z } from "zod";
import {
  $Environment,
  $ParameterStorePath,
  validateUniqueStringValues,
} from "./common";

const messageStatuses = [
  "pending_enrichment",
  "enriched",
  "sending",
  "delivered",
  "failed",
] as const;

const channelStatuses = [
  "created",
  "skipped",
  "sending",
  "delivered",
  "failed",
] as const;

const supplierStatuses = [
  "accepted",
  "cancelled",
  "delivered",
  "notification attempted",
  "notified",
  "pending_virus_check",
  "permanent_failure",
  "read",
  "received",
  "rejected",
  "technical_failure",
  "temporary_failure",
  "unnotified",
  "validation_failed",
  "virus_scan_failed",
] as const;

export const $MessageStatus = z.enum(messageStatuses).meta({
  title: "MessageStatus",
  description:
    "Message statuses documented by NHS Notify for overall message progress across all attempted channels.",
});

export const $ChannelStatus = z.enum(channelStatuses).meta({
  title: "ChannelStatus",
  description:
    "Channel statuses documented by NHS Notify for the progress of an individual channel in a message plan.",
});

export const $SupplierStatus = z.enum(supplierStatuses).meta({
  title: "SupplierStatus",
  description:
    "Supplier statuses documented by NHS Notify for detailed supplier-specific outcomes across channels.",
});

export const $ClientSubscription = z
  .object({
    environment: $Environment,
    callbackUrl: z.url().meta({
      description: "The URL to which event callbacks should be sent.",
    }),
    callbackApiTokenParameterPath: $ParameterStorePath.optional().meta({
      title: "Callback API Token Parameter Store Path",
      description:
        "AWS Systems Manager Parameter Store path containing the callback API token used when invoking the client subscription endpoint.",
      examples: [
        "/nhs-notify/client-config/subscriptions/example/callback-api-token",
      ],
    }),
    messageStatuses: z.array($MessageStatus).nonempty().optional().meta({
      description:
        "Set of overall message statuses to subscribe to, as documented on https://notify.nhs.uk/using-nhs-notify/message-channel-supplier-status.",
    }),
    channelStatuses: z.array($ChannelStatus).nonempty().optional().meta({
      description:
        "Set of channel statuses to subscribe to, as documented on https://notify.nhs.uk/using-nhs-notify/message-channel-supplier-status.",
    }),
    supplierStatuses: z.array($SupplierStatus).nonempty().optional().meta({
      description:
        "Set of supplier statuses to subscribe to, as documented on https://notify.nhs.uk/using-nhs-notify/message-channel-supplier-status.",
    }),
  })
  .superRefine((subscription, ctx) => {
    if (
      !subscription.messageStatuses &&
      !subscription.channelStatuses &&
      !subscription.supplierStatuses
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "ClientSubscription must declare at least one of messageStatuses, channelStatuses, or supplierStatuses",
        path: [],
      });
    }

    if (subscription.messageStatuses) {
      validateUniqueStringValues(
        subscription.messageStatuses,
        ctx,
        "messageStatuses",
        (status) => status,
        "status",
      );
    }

    if (subscription.channelStatuses) {
      validateUniqueStringValues(
        subscription.channelStatuses,
        ctx,
        "channelStatuses",
        (status) => status,
        "status",
      );
    }

    if (subscription.supplierStatuses) {
      validateUniqueStringValues(
        subscription.supplierStatuses,
        ctx,
        "supplierStatuses",
        (status) => status,
        "status",
      );
    }
  })
  .meta({
    title: "ClientSubscription",
    description:
      "Environment-scoped callback configuration for client subscription events.",
  });

export type MessageStatus = z.infer<typeof $MessageStatus>;
export type ChannelStatus = z.infer<typeof $ChannelStatus>;
export type SupplierStatus = z.infer<typeof $SupplierStatus>;
export type ClientSubscription = z.infer<typeof $ClientSubscription>;
