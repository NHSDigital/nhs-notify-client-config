import { z } from 'zod';
import { ConfigBase } from './common';

export const $GovuknotifyAccount = ConfigBase('GovuknotifyAccount').extend({
  name: z.string(),
  // apiKey: z.string().optional(), // We don't want to pass the API key around in the event, but need a way to fetch it when needed
  default: z.boolean(),
}).describe('GovuknotifyAccount');

export type GovuknotifyAccount = z.infer<typeof $GovuknotifyAccount>;
