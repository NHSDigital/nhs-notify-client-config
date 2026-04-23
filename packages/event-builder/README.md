# About

Helper library for building client-config CloudEvents.

This package is responsible for constructing client-config events from validated
domain objects. Event publishing is handled elsewhere.

## Event generation rules

### Clients

| Client `status` | Events built |
| --------------- | ------------ |
| `DRAFT` | None |
| `INT` | One `client.published.int` event with INT-scoped config only |
| `PROD` | One `client.published.int` event with INT-scoped config **and** one `client.published.prod` event with PROD-scoped config |
| `DISABLED` | One `client.disabled` event |

For `PROD`-status clients, environment-scoped collections
(`messageRequestsApimApplications`, `clientSubscriptions`,
`messageRequestsMeshMailboxes`, `digitalLettersMeshMailboxes`) are filtered so
each event only contains entries for its target environment.

### Campaigns

| Campaign `status` | Events built |
| ----------------- | ------------ |
| `DRAFT` | None |
| `INT` | One `campaign.published.int` event with INT-scoped config only |
| `PROD` | One `campaign.published.int` event with INT-scoped config **and** one `campaign.published.prod` event with PROD-scoped config |
| `DISABLED` | One `campaign.disabled` event |

For `PROD`-status campaigns, `govukNotifyConfigurations` is filtered so each
event only contains entries for its target environment.

## Library usage

Import the builders from `src/event-builder`:

```typescript
import { buildCampaignEvent, buildClientEvent } from "./src/event-builder";

const clientEvents = buildClientEvent(client);
const campaignEvents = buildCampaignEvent(campaign);
```

Both helpers return arrays because a single domain object can build zero, one,
or two events depending on its status.

### Example input

```json
{
  "id": "00f3b388-bbe9-41c9-9e76-052d37ee8988",
  "name": "Test Client",
  "slug": "test-client",
  "status": "PROD",
  "messageRequestsApimApplications": [
    { "environment": "INT", "applicationId": "int-apim-app-id" },
    { "environment": "PROD", "applicationId": "prod-apim-app-id" }
  ]
}
```
