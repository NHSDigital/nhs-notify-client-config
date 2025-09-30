import { z } from "zod";

export const $ClientInput = z.object({
  clientId: z.string(),
  clientName: z.string(),
  apimId: z.string(),
});

export type ClientInput = z.infer<typeof $ClientInput>;
