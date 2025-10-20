import { z } from "zod";
import { $Client } from "./client";
import { $Queue } from "./queue";
import { $FeatureFlag } from "./feature-flag";

export const $Audit = z.object({
  environment: z.string(),
  featureFlags: z.array($FeatureFlag),
  clients: z.array($Client),
  queues: z.array($Queue),
});

export type Audit = z.infer<typeof $Audit>;
