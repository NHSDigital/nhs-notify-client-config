import { z } from 'zod';
import { $ChannelType } from './channel';
import { idRef } from '../helpers/id-ref';
import { $Campaign } from './campaign';
import { ConfigBase } from './common';

export const $Queue = ConfigBase('Queue').extend({
  campaignId: idRef($Campaign).optional(),
  channelType: $ChannelType,
}).describe('Queue');

export type Queue = z.infer<typeof $Queue>;
