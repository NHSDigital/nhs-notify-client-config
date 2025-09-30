import { z } from "zod";
import * as fs from "node:fs";
import { $ClientBase } from "../domain/client";
import { $CampaignBase } from "../domain/campaign";
import { $Campaign, $Client } from "../domain";
import {
  $ClientSubscription,
  $ClientSubscriptionBase,
} from "../domain/client-subscription";

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
  fs.mkdirSync("client-config/domain", { recursive: true });
  const file = `client-config/domain/${key}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
