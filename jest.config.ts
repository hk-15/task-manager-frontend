import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|scss|less)$": "identity-obj-proxy",
  },
};

export default config;