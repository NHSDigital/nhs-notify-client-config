import { $Environment } from "@nhsdigital/nhs-notify-client-config-schemas/src/domain/common";
import { z } from "zod";

export const $ClientInput = z.object({
  clientId: z.string(),
  clientName: z.string(),
  apimId: z.string(),
  environment: $Environment,
});

export type ClientInput = z.infer<typeof $ClientInput>;
