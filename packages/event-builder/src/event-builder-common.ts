import { randomUUID } from "node:crypto";
import { Environment } from "@nhsdigital/nhs-notify-events-client-config/src/domain/common";
import schemaPackage from "@nhsdigital/nhs-notify-events-client-config/package.json";

export const eventSource =
  "//notify.nhs.uk/app/nhs-notify-client-config-dev/main";
export const schemaVersion = schemaPackage.version;

export function buildEnvelope<T>(
  subject: string,
  type: string,
  dataschema: string,
  data: T,
) {
  return {
    id: randomUUID(),
    datacontenttype: "application/json",
    time: new Date().toISOString(),
    specversion: "1.0",
    plane: "control",
    source: eventSource,
    subject,
    type,
    dataschema,
    dataschemaversion: schemaVersion,
    data,
  };
}

/** Filter an optional environment-scoped array to only entries matching the target. */
export function filterScoped<T extends { environment: Environment }>(
  items: T[] | undefined,
  target: Environment,
): T[] | undefined {
  if (!items) return undefined;
  const filtered = items.filter((item) => item.environment === target);
  return filtered.length > 0 ? filtered : undefined;
}
