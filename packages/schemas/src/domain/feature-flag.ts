import { z } from 'zod';
import { ConfigBase } from './common';

export const $FeatureFlag = ConfigBase('FeatureFlag').extend({
  name: z.string()
}).describe('FeatureFlag');

export type FeatureFlag = z.infer<typeof $FeatureFlag>;
