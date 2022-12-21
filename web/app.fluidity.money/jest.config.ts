import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  modulePaths: ["."],
  globals: {
    "fetch": require("cross-fetch"),
  }
};

export default config;
