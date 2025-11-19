import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.edugames.tv",
  appName: "TV",
  webDir: "dist",
  bundledWebRuntime: false,
  server: { androidScheme: "https", iosScheme: "capacitor" }
};

export default config;
