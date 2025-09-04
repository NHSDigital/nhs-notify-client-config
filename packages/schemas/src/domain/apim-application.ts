import { z } from 'zod';
import { ConfigBase } from './common';

export const $ApimApplication = ConfigBase('ApimApplication').extend({
  id: z.string(),
  apimId: z.string(),
}).describe('ApimApplication');

export type ApimApplication = z.infer<typeof $ApimApplication>;
