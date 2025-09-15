import { z } from 'zod';
import { $EventMetadata } from './base-metadata-schemas';
import { $ClientWithAPIM, $ClientWithMESH } from '../domain/client';

const $ClientChangedEventData = z.union([$ClientWithAPIM, $ClientWithMESH]);

const $ClientChangedEventMetadata = $EventMetadata.extend({
  type: z.literal('uk.nhs.notify.config.ClientChanged.v1'),
  dataschema: z.string().regex(/^https:\/\/notify\.nhs\.uk\/events\/schemas\/client-mutated\/1.\d+\.\d+\.json$/),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ClientChangedEvent = $ClientChangedEventMetadata.extend({
  data: $ClientChangedEventData,
}).describe('ClientChangedEvent');

export type ClientChangedEvent = z.infer<typeof $ClientChangedEvent>;
