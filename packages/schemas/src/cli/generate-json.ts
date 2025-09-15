import { z } from 'zod';
import * as fs from 'node:fs';
import packageJson from '../../package.json';
import { $ClientChangedEvent } from '../schemas/client-mutated-event';

const version = packageJson.version;

for (const [key, schema] of Object.entries({
  'client-mutated': $ClientChangedEvent
})) {
  const json = z.toJSONSchema(schema);
  const file = `json/${key}-${version}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
