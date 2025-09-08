import { z } from 'zod';
import { $EventMetadata } from './base-metadata-schemas';
import { $ClientWithAPIM, $ClientWithMESH } from '../domain/client';

const $ClientMutatedEventData = z.union([$ClientWithAPIM, $ClientWithMESH]);

const $ClientMutatedEventMetadata = $EventMetadata.extend({
  type: z.literal('uk.nhs.notify.config.ClientMutated.v1'),
  dataschema: z.string().regex(/^https:\/\/notify\.nhs\.uk\/events\/schemas\/client-mutated\/1.\d+\.\d+\.json$/),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ClientMutatedEvent = $ClientMutatedEventMetadata.extend({
  data: $ClientMutatedEventData,
}).describe('ClientMutatedEvent');

export type ClientMutatedEvent = z.infer<typeof $ClientMutatedEvent>;
