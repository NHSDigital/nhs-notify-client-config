import { z } from "zod";
import { $Environment, $ParameterStorePath } from "./common";

export const $GovuknotifyAccount = z
  .object({
    environment: $Environment,
    apiKeyParameterPath: $ParameterStorePath.meta({
      title: "GOV.UK Notify API Key Parameter Store Path",
      description:
        "AWS Systems Manager Parameter Store path containing the GOV.UK Notify API key for the target environment.",
      examples: ["/nhs-notify/client-config/gun/example/api-key"],
    }),
    senderId: z.string().optional().meta({
      description:
        "Optional GOV.UK Notify sender identifier for the target environment.",
    }),
  })
  .meta({
    title: "GovuknotifyAccount",
    description:
      "Environment-scoped GOV.UK Notify configuration for a campaign.",
  });

export type GovuknotifyAccount = z.infer<typeof $GovuknotifyAccount>;
