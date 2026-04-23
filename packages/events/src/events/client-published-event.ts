import { z } from "zod";
import { $EventMetadata } from "./base-metadata-schemas";
import { $Client } from "../domain";

function getClientEventDataschemaPattern(
  status: "int" | "prod" | "disabled",
): RegExp {
  switch (status) {
    case "disabled": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/client-disabled-1.\d+\.\d+\.json$/;
    }
    case "int": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/client-int-1.\d+\.\d+\.json$/;
    }
    case "prod": {
      return /^https:\/\/notify\.nhs\.uk\/events\/client-config\/client-prod-1.\d+\.\d+\.json$/;
    }
    default: {
      throw new Error(`Unsupported client event status: ${status}`);
    }
  }
}

function validateScopedClientEntries(
  client: z.infer<typeof $Client>,
  targetEnvironment: "INT" | "PROD",
  ctx: z.RefinementCtx,
): void {
  for (const [fieldName, items] of Object.entries({
    clientSubscriptions: client.clientSubscriptions,
    digitalLettersMeshMailboxes: client.digitalLettersMeshMailboxes,
    messageRequestsApimApplications: client.messageRequestsApimApplications,
    messageRequestsMeshMailboxes: client.messageRequestsMeshMailboxes,
  })) {
    if (items) {
      for (const [index, item] of items.entries()) {
        if (item.environment !== targetEnvironment) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} entries in a ${targetEnvironment.toLowerCase()} event must target ${targetEnvironment}`,
            path: ["data", fieldName, index, "environment"],
          });
        }
      }
    }
  }
}

function createClientEventSchema(
  status: "int" | "prod" | "disabled",
  dataStatus: "INT" | "PROD" | "DISABLED",
  targetEnvironment?: "INT" | "PROD",
) {
  return $EventMetadata
    .extend({
      type: z.literal(
        status === "disabled"
          ? `uk.nhs.notify.client-config.client.disabled.v1`
          : `uk.nhs.notify.client-config.client.published.${status}.v1`,
      ),
      dataschema: z.string().regex(getClientEventDataschemaPattern(status)),
      dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/),
    })
    .extend({
      data: $Client,
    })
    .superRefine((event, ctx) => {
      if (event.data.status !== dataStatus) {
        ctx.addIssue({
          code: "custom",
          message: `Client event payload status must be ${dataStatus}`,
          path: ["data", "status"],
        });
      }

      if (targetEnvironment) {
        validateScopedClientEntries(event.data, targetEnvironment, ctx);
      }
    });
}

export const $ClientIntEvent = createClientEventSchema("int", "INT", "INT");
export const $ClientProdEvent = createClientEventSchema("prod", "PROD", "PROD");
export const $ClientDisabledEvent = createClientEventSchema(
  "disabled",
  "DISABLED",
);
export const $ClientEvent = z.union([
  $ClientIntEvent,
  $ClientProdEvent,
  $ClientDisabledEvent,
]);

export type ClientIntEvent = z.infer<typeof $ClientIntEvent>;
export type ClientProdEvent = z.infer<typeof $ClientProdEvent>;
export type ClientDisabledEvent = z.infer<typeof $ClientDisabledEvent>;
export type ClientEvent = z.infer<typeof $ClientEvent>;
