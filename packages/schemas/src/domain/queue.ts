import {z} from 'zod';
import {$Channel} from './channel';
import {ConfigBase} from './common';
import { $ClientQuota } from "./client-quota";

export const $Queue = ConfigBase('Queue').extend({
  channel: $Channel,
  channelQuota: $ClientQuota.optional()
}).describe('Queue');

export type Queue = z.infer<typeof $Queue>;
