import { z } from 'zod';
import { ConfigBase } from './common';

export const $Layout = ConfigBase('Layout').extend({
  name: z.string(),
  contentBlocks: z.array(z.object({
    id: z.string(),
    description: z.string().optional(),
    type: z.enum(['TEXT', 'IMAGE']),
    maxLength: z.number(),
  })),
}).describe('Layout');

export type Layout = z.infer<typeof $Layout>;
export type LayoutId = Layout['id'];
