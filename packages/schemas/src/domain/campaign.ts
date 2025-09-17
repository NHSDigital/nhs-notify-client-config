import { z } from 'zod';
import { idRef } from '../helpers/id-ref';
import { $GovuknotifyAccount } from './govuknotify-account';
import { $Client } from './client';
import { ConfigBase } from './common';

export const $Campaign = ConfigBase('Campaign').extend({
  name: z.string(),
  clientId: idRef($Client),
  default: z.boolean(),
  govuknotifyAccount: $GovuknotifyAccount
}).describe('Campaign');

export type Campaign = z.infer<typeof $Campaign>;
