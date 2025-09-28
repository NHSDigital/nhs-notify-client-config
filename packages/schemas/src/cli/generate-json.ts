import { z } from "zod";
import * as fs from "node:fs";
import { $ClientBase } from "src/domain/client";
import { $CampaignBase } from "src/domain/campaign";
import { $Campaign, $Client } from "src/domain";
import {
  $ClientSubscription,
  $ClientSubscriptionBase,
} from "src/domain/client-subscription";

for (const [key, schema] of Object.entries({
  client: $Client,
  "client-base": $ClientBase,
  campaign: $Campaign,
  "campaign-base": $CampaignBase,
  "client-subscription": $ClientSubscription,
  "client-subscription-base": $ClientSubscriptionBase,
})) {
  const json = z.toJSONSchema(schema, {
    io: "input",
    target: "openapi-3.0",
    reused: "ref",
  });
  const file = `client-config/domain/${key}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
