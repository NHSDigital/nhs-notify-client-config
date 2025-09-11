import { convertCSV } from "../csv-to-client-input";

const invalidCases = [
  { type: "invalid headers", path: "test-data/invalid-headers.csv", msg: "CSV headers do not match expected." },
  { type: "empty rows", path: "test-data/empty-rows.csv", msg: "No client data provided." },
  { type: "missing data in row", path: "test-data/missing-data.csv", msg: "Missing data in row for client ID: client-id-1." }
]

describe("test that csv inputs get parsed as expected", () => {

  it("should successfully parse csv", () => {
    const filePath = "test-data/valid.csv";

    const result = convertCSV(filePath);

    expect(() => convertCSV(filePath)).not.toThrow();

    expect(result).toHaveLength(4);
    expect(result.map(item => item.clientId)).toEqual((["1","2","3","4"]));
  });

  it.each(invalidCases)('should throw error: "%s" for case: %s:', ({ msg, type, path }) => {
    expect(() => convertCSV(path)).toThrow(msg);
  });

});
