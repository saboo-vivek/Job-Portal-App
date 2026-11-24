exports.isValidGoogleDriveUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Google Drive & Docs file links with any valid query params or /view or /preview
  const driveRegex =
    /^https:\/\/(drive|docs)\.google\.com\/(file\/d\/|document\/d\/|open\?id=)[a-zA-Z0-9_-]+(\/(view|preview))?(\?.*)?$/i;

  // Also support general valid HTTP/HTTPS URLs (e.g. personal portfolio, PDF document link)
  const generalUrlRegex =
    /^https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i;

  return driveRegex.test(trimmed) || generalUrlRegex.test(trimmed);
};
