import { z } from 'zod';
import { $EventMetadata } from './base-metadata-schemas';
import { $Client } from '../domain';

const $ClientConfigPublishedEventMetadata = $EventMetadata.extend({
  type: z.literal('uk.nhs.notify.config.ClientChanged.v1'),
  dataschema: z.string().regex(/^https:\/\/notify\.nhs\.uk\/events\/schemas\/client-changed\/1.\d+\.\d+\.json$/),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ClientConfigPublishedEvent = $ClientConfigPublishedEventMetadata.extend({
  data: $Client,
}).describe('ClientConfigPublishedEvent');

export type ClientConfigPublishedEvent = z.infer<typeof $ClientConfigPublishedEvent>;
