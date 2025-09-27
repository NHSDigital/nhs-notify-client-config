import {z} from 'zod';
import {ConfigBase} from './common';

export const $GovuknotifyAccount = ConfigBase('GovuknotifyAccount').extend({
  name: z.string(),
  apiKey: z.string().optional().meta({
    description:
      `The API key for the GOV.UK Notify account.
      This will not be present in events, but may be fetched from the client config domain via API call.`,
  }),
}).describe('GovuknotifyAccount');

export type GovuknotifyAccount = z.infer<typeof $GovuknotifyAccount>;
