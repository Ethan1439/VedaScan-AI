/**
 * Returns the api path for the web app.
 * @param path The API endpoint path, e.g. "/api/herbs"
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath;
}

