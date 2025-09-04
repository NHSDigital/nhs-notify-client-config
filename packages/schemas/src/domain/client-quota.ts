import { z } from 'zod';

export const $ClientQuota = z.object({
  tps: z.number(),
  periodSeconds: z.number(),
  initialQuota: z.number(),
}).describe('ClientQuota');

export type ClientQuota = z.infer<typeof $ClientQuota>;
