import { z } from 'zod';
import { $ChannelType } from './channel';
import { ConfigBase } from './common';

export const $ChannelSupplier = ConfigBase('ChannelSupplier').extend({
  channelType: $ChannelType,
  outputQueue: z.string(),
}).describe('ChannelSupplier');

export type ChannelSupplier = z.infer<typeof $ChannelSupplier>;
