import { z } from 'zod';
import { $EventMetadata } from './base-metadata-schemas';
import { $Client } from '../domain';
import { $MeshMailbox } from '../domain/meshMailbox';
import { $ApimApplication } from '../domain/apimApplication';
import { $GovuknotifyAccount } from '../domain/govuknotifyAccount';

export const $ClientMutatedEventData = $Client.extend({
    meshMailbox: $MeshMailbox.optional(),
    apimApplication: $ApimApplication.optional(),
    govuknotifyAccount: $GovuknotifyAccount.optional()
  })
  .refine(client => !!client.meshMailbox || !!client.apimApplication, {
    error: "At least one of MESH or APIM is required as an integration method"
  });

const $ClientMutatedEventMetadata = $EventMetadata.extend({
  type: z.literal('uk.nhs.notify.config.ClientMutated'),
  dataschema: z.string().regex(/^https:\/\/notify\.nhs\.uk\/events\/schemas\/client-mutated-1.\d+\.\d+\.json$/),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $ClientMutatedEvent = $ClientMutatedEventMetadata.extend({
  data: $ClientMutatedEventData,
}).describe('ClientMutatedEvent');
