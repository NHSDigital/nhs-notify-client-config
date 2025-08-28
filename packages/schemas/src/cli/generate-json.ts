import { z } from 'zod';
import * as fs from 'node:fs';
import packageJson from '../../package.json';
import { $ClientMutatedEvent } from '../schemas/client-mutated-event';
import { $ConfigChangedEvent } from '../schemas/config-changed-event';
import { $ConfigRemovedEvent } from '../schemas/config-removed-event';

const version = packageJson.version;

for (const [key, schema] of Object.entries({
  'client-mutated': $ClientMutatedEvent,
  'config-changed': $ConfigChangedEvent,
  'config-removed': $ConfigRemovedEvent
})) {
  const json = z.toJSONSchema(schema);
  const file = `json/${key}-${version}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
