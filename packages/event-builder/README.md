# About

CLI tool for client configuration using events.

## Global Options

- --environment - The name of the environment to run the command on e.g 'de2-', 'int'. Required.
- --format - print data in JSON or tabular format. Default is JSON.

## Client Config Commands

- Create Client

## Create Client

- creates client using the most minimal client details required and defaults.

### Options

`--csv-file`: the path to the CSV file containing client details

**Note:** All headers in the CSV file must be provided with values:

- `Client Name` - the name of the client.
- `APIM ID` - the APIM Application ID for the client.

Multiple rows can be added to process more than one client.

### Usage

From the root folder i.e `nhs-notify-client-config`, run:

```bash
npm run --workspace=nhs-notify-client-config-event-builder cli -- create-client \
  --csv-file <path to file> \
  --environment <<env>>
```

## Example

```bash
npm run --workspace=nhs-notify-client-config-event-builder cli -- create-client \
  --csv-file inputs/sample.csv \
  --environment de2-aiyu1
```
