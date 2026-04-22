import { z } from "zod";
import { $Environment } from "./common";

export const $ApimApplication = z
  .object({
    environment: $Environment,
    applicationId: z.string().meta({
      description:
        "APIM application identifier used to authenticate requests in the target environment.",
    }),
  })
  .meta({
    title: "ApimApplication",
    description: "Environment-scoped APIM application configuration.",
  });

export type ApimApplication = z.infer<typeof $ApimApplication>;
