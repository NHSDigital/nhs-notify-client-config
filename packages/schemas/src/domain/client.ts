import { z } from 'zod';
import { idRef } from '../helpers/id-ref';
import { $MeshMailbox } from './mesh-mailbox';
import { $ApimApplication } from './apim-application';
import { $SuppressionFilter } from './suppression-filter';
import { $ClientQuota } from './client-quota';
import { ConfigBase } from './common';
import { $FeatureFlag } from './feature-flag';

export const $Client = ConfigBase('Client').extend({
  name: z.string(),
  senderOdsCode: z.string().optional(),
  quota: $ClientQuota.optional(),
  meshMailbox: $MeshMailbox.optional(),
  apimApplication: $ApimApplication.optional(),

  featureFlags: z.array(idRef($FeatureFlag)),
  rfrCodes: z.array(z.string()),
  suppressionFilters: z.array($SuppressionFilter),
})
.strict()
.describe('Client');

export const $ClientWithAPIM = $Client.extend({
  apimApplication: $ApimApplication
});

export const $ClientWithMESH = $Client.extend({
  meshMailbox: $MeshMailbox
});

export type Client = z.infer<typeof $Client>;
