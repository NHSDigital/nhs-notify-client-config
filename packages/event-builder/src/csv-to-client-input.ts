import fs from "fs";
import { parse } from "csv-parse/sync";
import { ClientInput } from './input'

type csvRow = {
  'Client Name': string;
  'APIM ID': string;
};

const csvHeaders = [
  "Client Name",
  "APIM ID"
]

export const convertCSV = (filePath: string): ClientInput[] => {
  const csvFile = fs.readFileSync(filePath, "utf-8");

  if(!validateHeaders(csvFile, csvHeaders)) {
    throw new Error("CSV headers do not match expected.");
  }

  return generateInputs(csvFile);
}

const generateInputs = (input: string): ClientInput[] => {
  const clients: ClientInput[] = [];

  const fileData: csvRow[] = parse(input, { columns: true, trim: true, skip_empty_lines: true });

  if (fileData.length < 1) {
    throw new Error("No client data provided.");
  }

  fileData.forEach((row: csvRow) => {
    if(!validateRow(row)) {
      throw new Error(`Missing data in row for client: ${row["Client Name"]}.`)
    }

    clients.push({
      clientName: row["Client Name"],
      apimId: row["APIM ID"]
    });
  })

  return clients;
}

const validateRow = (input: csvRow): boolean => {
  if (Object.values(input).some(v => v === undefined || v === "")) {
    return false;
  }
  return true;
}

const validateHeaders = (input: string, expectedCols: string[]): boolean => {
  const [headers] = parse(input, { to_line: 1 }) as string[][];

  const isMatch =
    headers.length === expectedCols.length &&
    headers.every((col, i) => col === expectedCols[i]);

  return isMatch;
}
