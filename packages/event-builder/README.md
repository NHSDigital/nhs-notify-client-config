# About

CLI and helper library for building client-config CloudEvents.

## Global Options

- `--environment` – The queue environment to send events to (e.g. `de2-aiyu1`, `int`). Required.
- `--format` – Print output in `json` or `table` format. Default is `json`.

## Commands

### `publish-clients`

Reads a JSON file containing one or more `Client` domain objects and publishes the appropriate CloudEvents to the queue.

Event generation rules:

| Client `status` | Events published |
| --------------- | -------------------------------- |
| `DRAFT` | None |
| `INT` | One `client.int` event (INT-scoped config only) |
| `PROD` | `client.int` event (INT-scoped) **+** `client.prod` event (PROD-scoped) |
| `DISABLED` | One `client.disabled` event |

For `PROD`-status clients, environment-scoped collections (`messageRequestsApimApplications`, `clientSubscriptions`, `messageRequestsMeshMailboxes`, `digitalLettersMeshMailboxes`) are automatically filtered so each event only contains entries for its target environment.

#### Options

`--json-file`: path to a JSON file containing a single `Client` object or an array of `Client` objects.

#### Usage

```bash
npm run --workspace=@nhsdigital/nhs-notify-client-config-event-builder cli -- publish-clients \
  --json-file <path/to/clients.json> \
  --environment <queue-env>
```

#### Example

```bash
npm run --workspace=@nhsdigital/nhs-notify-client-config-event-builder cli -- publish-clients \
  --json-file inputs/clients.json \
  --environment de2-aiyu1
```

#### Input format

Single client:

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

Array of clients:

```json
[
  { "id": "...", "name": "Client A", "slug": "client-a", "status": "INT", ... },
  { "id": "...", "name": "Client B", "slug": "client-b", "status": "PROD", ... }
]
```

## Library usage

This package also exports helpers for working directly with domain objects:

```typescript
import { buildClientEvent, buildCampaignEvent } from "./src/event-builder";

// Returns ClientEvent[] (0, 1 or 2 events depending on status)
const events = buildClientEvent(client);

// Returns CampaignEvent[] (0, 1 or 2 events depending on status)
const campaignEvents = buildCampaignEvent(campaign);
```

## Bundling for release

To build a self-contained CJS bundle for use in GitHub Actions:

```bash
npm run bundle:release --workspace @nhsdigital/nhs-notify-client-config-event-builder
```

The bundle is written to `packages/event-builder/artifacts/event-builder-bundle/index.cjs`.
