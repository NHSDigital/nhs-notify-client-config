import { z } from "zod";
import * as fs from "node:fs";
import { $Campaign, $Client } from "../domain";

for (const [key, schema] of Object.entries({
  client: $Client,
  campaign: $Campaign,
})) {
  const json = z.toJSONSchema(schema, {
    io: "input",
    target: "openapi-3.0",
    reused: "ref",
  });
  fs.mkdirSync("schemas/domain", { recursive: true });
  const file = `schemas/domain/${key}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
