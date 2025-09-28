import { z } from "zod";

export const $Channel = z.enum(["NHSAPP", "SMS", "EMAIL", "LETTER"]).meta({
  title: "Channel",
  description: "A channel with which a message can be sent",
});

export type Channel = z.infer<typeof $Channel>;
