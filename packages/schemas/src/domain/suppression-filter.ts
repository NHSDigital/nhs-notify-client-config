import { z } from 'zod';
import { ConfigBase } from './common';

export const $SuppressionFilter = ConfigBase('SuppressionFilter').extend({
  pattern: z.string(),
}).describe('SuppressionFilter');

export type SuppressionFilter = z.infer<typeof $SuppressionFilter>;
