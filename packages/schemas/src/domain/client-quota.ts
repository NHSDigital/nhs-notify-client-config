import { z } from "zod";

export const $ClientQuota = z
  .object({
    maxRequestsPerSecond: z.number().meta({
      description: `The maximum number of requests that can be made by the client in one second (TPS or Transactions Per Second).`,
    }),
  })
  .meta({
    title: "ClientQuota",
  });

export type ClientQuota = z.infer<typeof $ClientQuota>;
