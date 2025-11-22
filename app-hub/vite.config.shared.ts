import { resolve } from "node:path";
export const aliasConfig = {
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "shared/*")
    }
  }
};
