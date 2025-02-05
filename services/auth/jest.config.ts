import type { Config } from "@jest/types";

export const config: Config.InitialOptions = {
  collectCoverage: true,
  moduleFileExtensions: ["ts"],
  preset: "ts-jest",
  testMatch: ["**/*.spec.ts"],
  transform: {
    "**/*.ts": "ts-jest",
  },
  verbose: true,
};
