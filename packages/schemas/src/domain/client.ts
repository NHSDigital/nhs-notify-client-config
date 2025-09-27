import {z} from 'zod';
import {idRef} from '../helpers/id-ref';
import {$MeshMailbox} from './mesh-mailbox';
import {$ApimApplication} from './apim-application';
import {$SuppressionFilter} from './suppression-filter';
import {$ClientQuota} from './client-quota';
import {$Environment, ConfigBase} from './common';
import {$FeatureFlag} from './feature-flag';

export const $Client = ConfigBase('Client').extend({
  name: z.string(),
  environment: $Environment,
  senderOdsCode: z.string().optional(),
  pdsQuota: $ClientQuota.optional(),
  meshMailbox: $MeshMailbox.optional(),
  apimApplication: $ApimApplication.optional(),

  featureFlags: z.array(idRef($FeatureFlag)).optional(),
  rfrCodes: z.array(z.string()).optional(),
  suppressionFilters: z.array($SuppressionFilter).optional(),
}).meta({
  title: 'Client',
  description:
    `A client represents an organisation or service that sends communications.
    Each client may be associated with a single APIM application, which is used to authenticate API requests,
    and a single Mesh mailbox, which is used to send and receive batch requests and daily reports via Mesh.`
});

export type Client = z.infer<typeof $Client>;
