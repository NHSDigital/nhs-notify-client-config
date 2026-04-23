import { z } from "zod";
import { $EventMetadata } from "./base-metadata-schemas";
import { $Campaign } from "../domain";

function getCampaignEventDataschemaPattern(
  status: "int" | "prod" | "disabled",
): RegExp {
  switch (status) {
    case "disabled": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/campaign-disabled-1.\d+\.\d+\.json$/;
    }
    case "int": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/campaign-int-1.\d+\.\d+\.json$/;
    }
    case "prod": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/campaign-prod-1.\d+\.\d+\.json$/;
    }
    default: {
      throw new Error(`Unsupported campaign event status: ${status}`);
    }
  }
}

function validateScopedCampaignEntries(
  campaign: z.infer<typeof $Campaign>,
  targetEnvironment: "INT" | "PROD",
  ctx: z.RefinementCtx,
): void {
  if (campaign.govukNotifyConfigurations) {
    for (const [index, item] of campaign.govukNotifyConfigurations.entries()) {
      if (item.environment !== targetEnvironment) {
        ctx.addIssue({
          code: "custom",
          message: `govukNotifyConfigurations entries in a ${targetEnvironment.toLowerCase()} event must target ${targetEnvironment}`,
          path: ["data", "govukNotifyConfigurations", index, "environment"],
        });
      }
    }
  }
}

function createCampaignEventSchema(
  status: "int" | "prod" | "disabled",
  dataStatus: "INT" | "PROD" | "DISABLED",
  targetEnvironment?: "INT" | "PROD",
) {
  return $EventMetadata
    .extend({
      type: z.literal(`uk.nhs.notify.client-config.campaign.${status}.v1`),
      dataschema: z.string().regex(getCampaignEventDataschemaPattern(status)),
      dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/),
    })
    .extend({
      data: $Campaign,
    })
    .superRefine((event, ctx) => {
      if (event.data.status !== dataStatus) {
        ctx.addIssue({
          code: "custom",
          message: `Campaign event payload status must be ${dataStatus}`,
          path: ["data", "status"],
        });
      }

      if (targetEnvironment) {
        validateScopedCampaignEntries(event.data, targetEnvironment, ctx);
      }
    });
}

export const $CampaignIntEvent = createCampaignEventSchema("int", "INT", "INT");
export const $CampaignProdEvent = createCampaignEventSchema(
  "prod",
  "PROD",
  "PROD",
);
export const $CampaignDisabledEvent = createCampaignEventSchema(
  "disabled",
  "DISABLED",
);
export const $CampaignEvent = z.union([
  $CampaignIntEvent,
  $CampaignProdEvent,
  $CampaignDisabledEvent,
]);

export type CampaignIntEvent = z.infer<typeof $CampaignIntEvent>;
export type CampaignProdEvent = z.infer<typeof $CampaignProdEvent>;
export type CampaignDisabledEvent = z.infer<typeof $CampaignDisabledEvent>;
export type CampaignEvent = z.infer<typeof $CampaignEvent>;
