# CSV to Event Generator CLI

## Usage

1. Place the CSV file in the `event-builder/inputs` folder e.g `sample.csv`. All headers must be provided with values:
    - `Client ID` - the ID of the client you want to create. This can be generated with an online UUID generator.
    - `Client Name` - the name of the client
    - `APIM ID` - the APIM Application ID for the client

    Multiple rows can be added to process more than one client.

2. From the `event-builder` folder, run:

```bash
npm run --workspace=nhs-notify-client-config-event-builder cli -- generate-event \
  --csv-file <path to file> \
  --environment <<env>>
```

## Example

```bash
npm run --workspace=nhs-notify-client-config-event-builder cli -- generate-event \
  --csv-file ../inputs/sample.csv \
  --environment de2-aiyu1
```
