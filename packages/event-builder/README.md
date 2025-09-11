# CSV to Event Generator CLI

## Usage

- Place the CSV file in the `event-builder/inputs` folder
- From the `event-builder` folder, run:

```bash
pnpm --filter @nhs-notify-config/event-builder cli generate-event --csv-file <<path to file>>
```

## Example

```bash
pnpm --filter @nhs-notify-config/event-builder cli generate-event --csv-file ../inputs/sample.csv
```
