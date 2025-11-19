import { resolve } from "node:path";
import type { UserConfig } from "vite";

export const aliasConfig: UserConfig["resolve"] = {
  alias: {
    "@shared": resolve(__dirname, "shared/src")
  }
};
