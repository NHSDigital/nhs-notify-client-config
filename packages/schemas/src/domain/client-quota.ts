import {z} from 'zod';

export const $ClientQuota = z.object({
  maxRequestsPerSecond: z.number().meta({
    description:
      `The maximum number of requests that can be made by the client in one second (TPS or Transactions Per Second).`,
  }),
  maxRequestsPerDay: z.number().optional().meta({
    description:
      `An optional maximum number of requests that can be made by the client in one day.`,
  })
}).describe('ClientQuota');

export type ClientQuota = z.infer<typeof $ClientQuota>;
