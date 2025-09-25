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
  environment: z.string(),
  senderOdsCode: z.string().optional(),
  quota: $ClientQuota.optional(),
  meshMailbox: $MeshMailbox.optional(),
  apimApplication: $ApimApplication.optional(),

  featureFlags: z.array(idRef($FeatureFlag)).optional(),
  rfrCodes: z.array(z.string()).optional(),
  suppressionFilters: z.array($SuppressionFilter).optional(),
})
.strict()
.describe('Client');

export type Client = z.infer<typeof $Client>;
