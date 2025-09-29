export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
};
