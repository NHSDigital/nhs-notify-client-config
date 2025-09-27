import {z} from 'zod';
import * as fs from 'node:fs';
import packageJson from '../../package.json';
import {$Client} from "../domain";

const version = packageJson.version;

for (const [key, schema] of Object.entries({
  'client': $Client,
})) {
  const json = z.toJSONSchema(schema, {io: 'input', target: 'openapi-3.0', reused: 'ref'});
  const file = `json/${key}-${version}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
