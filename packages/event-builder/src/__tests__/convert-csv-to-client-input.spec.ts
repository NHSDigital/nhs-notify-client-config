import path from "path";
import { convertCSV } from "../csv-to-client-input";

const invalidCases = [
  { type: "invalid headers", relativePath: "test-data/invalid-headers.csv", msg: "CSV headers do not match expected." },
  { type: "empty rows", relativePath: "test-data/empty-rows.csv", msg: "No client data provided." },
  { type: "missing data in row", relativePath: "test-data/missing-data.csv", msg: "Missing data in row for client: Test Client 1." }
]

describe("test that csv inputs get parsed as expected", () => {

  it("should successfully parse csv", () => {
    const filePath = path.join(__dirname, "test-data/valid.csv");

    const result = convertCSV(filePath);

    expect(() => convertCSV(filePath)).not.toThrow();

    expect(result).toHaveLength(4);
    expect(result.map(item => item.clientName)).toEqual(["Test Client 1", "Test Client 2", "Test Client 3", "Test Client 4"]);
  });

  it.each(invalidCases)('should throw error: "%s" for case: %s:', ({ msg, type, relativePath }) => {

    const filePath = path.join(__dirname, relativePath);

    expect(() => convertCSV(filePath)).toThrow(msg);
  });

});
