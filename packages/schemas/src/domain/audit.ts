import { z } from 'zod';
import { $Client } from './client';
import { $ChannelSupplier } from './channel-supplier';
import { $SupplierQuota } from './supplier-quota';
import { $Queue } from './queue';
import { $FeatureFlag } from './feature-flag';
import { $RoutingConfig } from './routing';

export const $Audit = z.object({
  environment: z.string(),
  featureFlags: z.array($FeatureFlag),
  clients: z.array($Client),
  queues: z.array($Queue),
  channelSuppliers: z.array($ChannelSupplier),
  supplierQuotas: z.array($SupplierQuota),
  routingConfigs: z.array($RoutingConfig),
});

export type Audit = z.infer<typeof $Audit>;
