import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { ClientInput } from 'nhs-notify-config-event-builder/src/input'

const columns = [
  "Client ID",
  "Client Name",
  "APIM ID",
  "Notify Account"
]

export const convertCSV = (filePath: string): ClientInput => {
  const csvFile = fs.readFileSync(path.join(__dirname, filePath), "utf-8");

  if(!validateColumns(csvFile, columns)) {
    throw new Error("CSV headers do not match expected.");
  }

  const fileData = parse(csvFile, { columns: true, trim: true, skip_empty_lines: true });

  if (fileData.length < 1) {
    throw new Error("No client data provided");
  }

  if(!validateInput(fileData[0])) {
    throw new Error("Missing data in column")
  }

  return {
    clientId: fileData[0][columns[0]],
    clientName: fileData[0][columns[1]],
    apimId: fileData[0][columns[2]]
  }
}

const validateInput = (input: ClientInput): boolean => {
  if (Object.values(input).some(v => v === undefined)) {
    return false;
  }
  return true;
}

const validateColumns = (input: string, expectedCols: string[]): boolean => {
  const [headers] = parse(input, { to_line: 1 }) as string[][];

  const isMatch =
    headers.length === expectedCols.length &&
    headers.every((col, i) => col === expectedCols[i]);

  return isMatch;
}
