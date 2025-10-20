import { z } from "zod";
import { ConfigBase } from "./common";

export const $SuppressionFilter = ConfigBase("SuppressionFilter")
  .extend({
    name: z.string(),
    pattern: z.string(),
  })
  .meta({
    title: "SuppressionFilter",
    description: `A suppression filter pattern to exclude communications to certain contact details.`,
  });

export type SuppressionFilter = z.infer<typeof $SuppressionFilter>;
