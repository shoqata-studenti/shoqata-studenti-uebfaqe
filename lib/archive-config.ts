/**
 * Arkivi (galeria e fotove) është ende në punë:
 * - `next dev` (lokal): gjithmonë i dukshëm.
 * - Production (Vercel): vetëm kur ARCHIVE_ENABLED=true është vendosur si variabël mjedisi.
 */
export function archiveEnabled(): boolean {
  return process.env.NODE_ENV === "development" || process.env.ARCHIVE_ENABLED === "true";
}
