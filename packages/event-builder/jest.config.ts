import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/../../packages/schemas/dist/",
  ],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "^@nhsdigital/nhs-notify-events-client-config/src/(.*)$":
      "<rootDir>/../../packages/events/src/$1",
    "^@nhsdigital/nhs-notify-events-client-config$":
      "<rootDir>/../../packages/events/src",
    "^@nhsdigital/nhs-notify-events-client-config/package.json$":
      "<rootDir>/../../packages/events/package.json",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
};

export default config;
