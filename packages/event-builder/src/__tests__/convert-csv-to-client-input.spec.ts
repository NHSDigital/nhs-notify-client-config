import path from "node:path";
import convertCSV from "../csv-to-client-input";

const invalidCases = [
  {
    type: "invalid headers",
    relativePath: "test-data/invalid-headers.csv",
    msg: "CSV headers do not match expected.",
  },
  {
    type: "empty rows",
    relativePath: "test-data/empty-rows.csv",
    msg: "No client data provided.",
  },
  {
    type: "missing data in row",
    relativePath: "test-data/missing-data.csv",
    msg: "Missing data in row for client ID: client-id-1.",
  },
];

describe("test that csv inputs get parsed as expected", () => {
  it("should successfully parse csv", () => {
    const filePath = path.join(__dirname, "test-data/valid.csv");
    const testEnv = "test";

    const result = convertCSV(filePath, testEnv);

    expect(() => convertCSV(filePath, testEnv)).not.toThrow();

    expect(result).toHaveLength(4);
    expect(result.map((item) => item.clientId)).toEqual(["1", "2", "3", "4"]);
  });

  it.each(invalidCases)(
    'should throw error: "%s" for case: %s:',
    ({ msg, relativePath }) => {
      const filePath = path.join(__dirname, relativePath);
      const testEnv = "test";

      expect(() => convertCSV(filePath, testEnv)).toThrow(msg);
    },
  );
});
