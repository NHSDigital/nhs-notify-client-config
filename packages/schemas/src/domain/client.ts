import { z } from "zod";
import { $MeshMailbox } from "./mesh-mailbox";
import { $ApimApplication } from "./apim-application";
import { $SuppressionFilter } from "./suppression-filter";
import { $ClientQuota } from "./client-quota";
import { $Environment, ConfigBase } from "./common";
import { $FeatureFlag } from "./feature-flag";
import { idRef } from "../helpers/id-ref";
import rfrCoding from "./rfr-coding";

export const $ClientBase = ConfigBase("Client")
  .extend({
    name: z.string(),
    environment: $Environment,
  })
  .meta({
    title: "ClientBase",
    description: `Base schema for clients, defining identifying fields.`,
  });

export const $Client = $ClientBase
  .extend({
    senderOdsCode: z.string().optional(),
    pdsQuota: $ClientQuota.optional(),
    meshMailbox: $MeshMailbox.optional(),
    apimApplication: $ApimApplication.optional(),

    featureFlags: z.array(idRef($FeatureFlag)).optional(),
    rfrCodes: z.array(z.enum(Object.keys(rfrCoding))).optional(),
    suppressionFilters: z.array($SuppressionFilter).optional(),
  })
  .meta({
    title: "Client",
    description: `A client represents an organisation or service that sends communications.
    Each client may be associated with a single APIM application, which is used to authenticate API requests,
    and a single Mesh mailbox, which is used to send and receive batch requests and daily reports via Mesh.`,
  });

export const $ClientId = $Client.shape.id;
export type Client = z.infer<typeof $Client>;
