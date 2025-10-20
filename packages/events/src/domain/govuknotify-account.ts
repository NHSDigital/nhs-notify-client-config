import { z } from "zod";

export const $GovuknotifyAccount = z
  .object({
    name: z.string(),
    apiKey: z
      .string()
      .optional()
      .meta({
        description: `The API key for the GOV.UK Notify account.
      This will not be present in events, but may be fetched from the client config domain via API call.`,
      }),
  })
  .meta({
    title: "GovuknotifyAccount",
  });

export type GovuknotifyAccount = z.infer<typeof $GovuknotifyAccount>;
