import {z} from "zod";
import {$MeshMailbox} from "./mesh-mailbox";
import {$ApimApplication} from "./apim-application";
import {$SuppressionFilter} from "./suppression-filter";
import {$ClientQuota} from "./client-quota";
import {$Environment, ConfigBase} from "./common";
import {$FeatureFlag} from "./feature-flag";
import {idRef} from "../helpers/id-ref";
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
    rfrCodes: z.array(z.enum(Object.keys(rfrCoding))).optional().meta({
      title: "Reason for Removal Codes",
      description:
        `When sending a communication to a recipient, the reason for removal codes (RFR codes) indicate
why a recipient has been removed from their GP's registered patient list.
See https://data.developer.nhs.uk/dms/mim/6.3.01/Vocabulary/NHAISRemovalReasonCode.htm for information on possible codes.

PDS currently only provides a subset of 'Exit' codes, including those for Deceased patients.
* DEA - Death
* EMB - Embarkation
* SCT - Transferred to Scotland
* NIT - Transferred to Northern Ireland
* TRA - Temporary resident not returned
* ORR - Other reason
`,
    }),
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
