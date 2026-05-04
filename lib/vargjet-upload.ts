/** Madhësia maksimale e një dokumenti (4 MB). */
export const VARGJET_MAX_FILE_BYTES = 4 * 1024 * 1024;

const ALLOWED = new Set([
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export function isAllowedVargjetMime(mime: string): boolean {
  return ALLOWED.has(mime);
}
