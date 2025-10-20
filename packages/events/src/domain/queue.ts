import { z } from "zod";
import { $ClientQuota } from "./client-quota";
import { $Channel } from "./channel";
import { ConfigBase } from "./common";

export const $Queue = ConfigBase("Queue")
  .extend({
    channel: $Channel,
    queueQuota: $ClientQuota.optional(),
  })
  .meta({
    title: "Queue",
  });

export type Queue = z.infer<typeof $Queue>;
