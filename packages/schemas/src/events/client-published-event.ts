import { z } from "zod";
import { $EventMetadata } from "./base-metadata-schemas";
import { $Client } from "../domain";

const $ClientPublishedEventMetadata = $EventMetadata.extend({
  type: z.literal("uk.nhs.notify.client-config.client-published.v1"),
  dataschema: z
    .string()
    .regex(
      /^https:\/\/notify\.nhs\.uk\/events\/client-config\/client-published-1.\d+\.\d+\.json$/,
    ),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ClientPublishedEvent = $ClientPublishedEventMetadata
  .extend({
    data: $Client,
  })
  .describe("ClientConfigPublishedEvent");

export type ClientPublishedEvent = z.infer<typeof $ClientPublishedEvent>;
