import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { ClientInput } from "./input";

type CsvRow = {
  "Client ID": string;
  "Client Name": string;
  "APIM ID": string;
};

const csvHeaders = ["Client ID", "Client Name", "APIM ID"];

const validateRow = (input: CsvRow): boolean => {
  return !Object.values(input).some((v) => v == null || v === "");
};

const generateInputs = (input: string, env: string): ClientInput[] => {
  const clients: ClientInput[] = [];

  const fileData: CsvRow[] = parse(input, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
  });

  if (fileData.length === 0) {
    throw new Error("No client data provided.");
  }

  for (const row of fileData) {
    if (!validateRow(row)) {
      throw new Error(
        `Missing data in row for client ID: ${row["Client ID"]}.`,
      );
    }

    clients.push({
      clientId: row["Client ID"],
      clientName: row["Client Name"],
      apimId: row["APIM ID"],
      environment: env,
    });
  }

  return clients;
};

const validateHeaders = (input: string, expectedCols: string[]): boolean => {
  const [headers] = parse(input, { to_line: 1 });

  const isMatch =
    headers.length === expectedCols.length &&
    headers.every((col, i) => col === expectedCols[i]);

  return isMatch;
};

const convertCSV = (filePath: string, environment: string): ClientInput[] => {
  try {
    const csvFile = fs.readFileSync(filePath, "utf8");

    if (!validateHeaders(csvFile, csvHeaders)) {
      throw new Error("CSV headers do not match expected.");
    }
    return generateInputs(csvFile, environment);
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(
        `Failed to process CSV file at ${filePath}: ${error.message}`,
      );
    }
    throw error;
  }
};

export default convertCSV;
