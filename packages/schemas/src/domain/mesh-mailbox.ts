import { z } from "zod";

export const $MeshMailbox = z
  .object({
    mailboxId: z.string(),
    workflowIdSuffix: z.string().optional(),
    workflowIdReceiveRequestAck: z.string().optional(),
    workflowIdCompletedRequestItemsReport: z.string().optional(),
  })
  .meta({
    title: "MeshMailbox",
    description: `A Mesh Mailbox associated with a client`,
  });

export type MeshMailbox = z.infer<typeof $MeshMailbox>;
