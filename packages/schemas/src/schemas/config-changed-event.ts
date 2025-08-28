import { z } from 'zod';
import { $EventMetadata } from './base-metadata-schemas';
import { $SupplierQuota, $ChannelSupplier, $FeatureFlag, $Campaign } from '../domain';
import { $Specification } from '../domain/specification';
import { $ClientSubscription } from '../domain/clientSubscription';
import { $Queue } from '../domain/queue';
import { $SpecificationSupplier } from '../domain/specificationSupplier';

export const $ConfigChangedEventData = z.discriminatedUnion('configType', [
    z.object({
      configType: z.literal('campaign'),
      record: $Campaign,
    }),
    z.object({
      configType: z.literal('client-subscription'),
      record: $ClientSubscription,
    }),
    z.object({
      configType: z.literal('channel-supplier'),
      record: $ChannelSupplier,
    }),
    z.object({
      configType: z.literal('queue'),
      record: $Queue,
    }),
    z.object({
      configType: z.literal('supplier-quota'),
      record: $SupplierQuota,
    }),
    z.object({
      configType: z.literal('feature-flag'),
      record: $FeatureFlag,
    }),
    z.object({
      configType: z.literal('specification'),
      record: $Specification,
    }),
    z.object({
      configType: z.literal('specification-supplier'),
      record: $SpecificationSupplier,
    })
  ]
);

const $ConfigChangedEventMetadata = $EventMetadata.extend({
  type: z.literal('uk.nhs.notify.config.ConfigChanged'),
  dataschema: z.string().regex(/^https:\/\/notify\.nhs\.uk\/events\/schemas\/config-changed-1.\d+\.\d+\.json$/),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ConfigChangedEvent = $ConfigChangedEventMetadata.extend({
  data: $ConfigChangedEventData,
}).describe('ConfigChangedEvent');
