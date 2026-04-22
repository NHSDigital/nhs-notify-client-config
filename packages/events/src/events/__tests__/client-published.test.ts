import fs from "node:fs";
import path from "node:path";
import { $Client } from "../../domain/client";
import { $ClientIntEvent, $ClientProdEvent } from "../client-published-event";

function readJson(filename: string): unknown {
  const filePath = path.resolve(__dirname, "./testData/", filename);

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("Client event validations", () => {
  it("should validate an INT-targeted client event", () => {
    const json = readJson("client-valid.json");

    expect(() => $ClientIntEvent.parse(json)).not.toThrow();
  });

  it("should validate a PROD-targeted client event", () => {
    const json = readJson("client-prod-valid.json");

    expect(() => $ClientProdEvent.parse(json)).not.toThrow();
  });

  it("should reject a target event containing config for the wrong environment", () => {
    const json = readJson("client-int-with-prod-config.json");

    expect(() => $ClientIntEvent.parse(json)).toThrow();
  });

  it("should reject duplicate client config entries for the same environment", () => {
    const json = readJson("client-with-duplicate-apim-environment.json");

    expect(() => $Client.parse(json)).toThrow(
      /messageRequestsApimApplications must contain at most one entry per environment/u,
    );
  });
});
