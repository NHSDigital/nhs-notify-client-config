import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "@nhsdigital/nhs-notify-client-config-schemas$":
      "<rootDir>/../../packages/schemas/src",
  },
};

export default config;
