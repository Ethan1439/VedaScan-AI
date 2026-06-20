import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vedascan.ai",
  appName: "VedaScan AI",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
