import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default config;
