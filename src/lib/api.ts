import { Capacitor } from "@capacitor/core";

// Live hosted base server URL for the Android app's API calls
const HOSTED_BASE_URL = "https://ais-dev-pfrwn2nczfegc4w2vtwsug-1005962287178.asia-southeast1.run.app";

/**
 * Returns the absolute URL when running on Native (Capacitor) or relative path on normal Web
 * @param path The API endpoint path, e.g. "/api/herbs"
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (Capacitor.isNativePlatform()) {
    return `${HOSTED_BASE_URL}${cleanPath}`;
  }
  return cleanPath;
}
