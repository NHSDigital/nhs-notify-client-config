import { z } from 'zod';
import { idRef } from '../helpers/id-ref';
import { $Client } from './client';
import { ConfigBase } from './common';

export const $ClientSubscription = ConfigBase('ClientSubscription').extend({
  clientId: idRef($Client),
  callbackUrl: z.string(),
  callbackSecretId: z
    .string()
    .describe('ID of callback secret in config domain'),
  subscribedEvents: z.array(z.string()),
}).describe('ClientSubscription');

export type ClientSubscription = z.infer<typeof $ClientSubscription>;
