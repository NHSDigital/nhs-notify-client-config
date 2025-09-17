import { z } from 'zod';
import { ConfigBase } from './common';

export const $MeshMailbox = ConfigBase('MeshMailbox').extend({
  mailboxId: z.string(),
  workflowIdSuffix: z.string().optional(),
  workflowIdReceiveRequestAck: z.string().optional(),
  workflowIdCompletedRequestItemsReport: z.string().optional(),
}).describe('MeshMailbox');

export type MeshMailbox = z.infer<typeof $MeshMailbox>;
