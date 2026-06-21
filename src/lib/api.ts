/**
 * Returns the api path for the web app.
 * @param path The API endpoint path, e.g. "/api/herbs"
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // If running on GitHub Pages (github.io) or any external static hosting environment
  // that doesn't host the custom Express server, redirect requests to our live-hosted Cloud Run instance.
  if (typeof window !== "undefined") {
    const isGitHubPages = window.location.hostname.endsWith("github.io");
    const isDevContainer = window.location.hostname.includes("asia-southeast1.run.app");
    const isLocalServer = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    // If we're on GitHub Pages, or any non-container environment (and we aren't running local dev server)
    if (isGitHubPages || (!isDevContainer && !isLocalServer)) {
      return `https://ais-pre-pfrwn2nczfegc4w2vtwsug-1005962287178.asia-southeast1.run.app${cleanPath}`;
    }
  }

  return cleanPath;
}

