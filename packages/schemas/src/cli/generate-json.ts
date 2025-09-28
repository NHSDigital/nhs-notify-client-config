import {z} from 'zod';
import * as fs from 'node:fs';
import packageJson from '../../package.json';
import {$Campaign, $Client} from '../domain';
import {$ClientSubscription, $ClientSubscriptionBase} from '../domain/client-subscription';
import {$ClientBase} from "../domain/client";
import { $CampaignBase } from "../domain/campaign";

const version = packageJson.version;

for (const [key, schema] of Object.entries({
  'client': $Client,
  'client-base': $ClientBase,
  'campaign': $Campaign,
  'campaign-base': $CampaignBase,
  'client-subscription': $ClientSubscription,
  'client-subscription-base': $ClientSubscriptionBase
})) {
  const json = z.toJSONSchema(schema, {io: 'input', target: 'openapi-3.0', reused: 'ref'});
  const file = `client-config/domain/${key}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
