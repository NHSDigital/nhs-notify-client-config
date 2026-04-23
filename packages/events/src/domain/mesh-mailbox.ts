import { z } from "zod";
import { $Environment } from "./common";

const $EnvironmentScopedMailbox = z.object({
  environment: $Environment,
  mailboxId: z.string().meta({
    description: "MESH mailbox identifier for the target environment.",
  }),
});

export const $MessageRequestsMeshMailbox = $EnvironmentScopedMailbox
  .extend({
    workflowIdPrefix: z.string().meta({
      description:
        "Workflow identifier prefix used for message request exchanges in the target environment.",
    }),
  })
  .meta({
    title: "MessageRequestsMeshMailbox",
    description:
      "Environment-scoped MESH mailbox configuration used for message request traffic.",
  });

export const $DigitalLettersMeshMailbox = $EnvironmentScopedMailbox.meta({
  title: "DigitalLettersMeshMailbox",
  description:
    "Environment-scoped MESH mailbox configuration used for Digital Letters integrations.",
});

export type MessageRequestsMeshMailbox = z.infer<
  typeof $MessageRequestsMeshMailbox
>;
export type DigitalLettersMeshMailbox = z.infer<
  typeof $DigitalLettersMeshMailbox
>;
