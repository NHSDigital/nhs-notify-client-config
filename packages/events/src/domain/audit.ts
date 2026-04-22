import { z } from "zod";
import { $Client } from "./client";
import { $Queue } from "./queue";
import { $FeatureFlag } from "./feature-flag";
import { $Campaign } from "./campaign";

export const $Audit = z.object({
  environment: z.string(),
  featureFlags: z.array($FeatureFlag),
  clients: z.array($Client),
  campaigns: z.array($Campaign),
  queues: z.array($Queue),
});

export type Audit = z.infer<typeof $Audit>;
