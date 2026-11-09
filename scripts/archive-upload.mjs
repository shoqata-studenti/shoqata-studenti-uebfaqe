/**
 * Ngarkon fotot e një eventi në Cloudinary dhe shkruan listën e tyre në `lib/archive-photos/<slug>.json`.
 *
 * Ekzekuto: `npm run archive:upload -- <slug> <dosja-me-foto>`
 * p.sh.     `npm run archive:upload -- 25-vjetori ~/Projects/shoqata-arkivi/originals/25-vjetori/fotos`
 *
 * - Ngarkon paralelisht (6 njëkohësisht); Cloudinary i zvogëlon fotot në max. 2400 px gjatë ngarkimit.
 * - Mund të ekzekutohet sërish: fotot që janë tashmë në listë anashkalohen, të rejat shtohen.
 * - Pas ngarkimit: kontrollo faqen lokalisht, pastaj bëj commit `lib/archive-photos/<slug>.json`.
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);
const CONCURRENCY = 6;

const [slug, folderArg] = process.argv.slice(2);
if (!slug || !folderArg || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Përdorimi: npm run archive:upload -- <slug> <dosja-me-foto>   (slug: vetëm a-z, 0-9, -)");
  process.exit(1);
}
const folder = path.resolve(folderArg.replace(/^~(?=\/)/, process.env.HOME ?? "~"));
if (!fs.existsSync(folder)) {
  console.error(`Dosja nuk ekziston: ${folder}`);
  process.exit(1);
}

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Mungojnë CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET në .env.local");
  process.exit(1);
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const manifestPath = path.join(root, "lib", "archive-photos", `${slug}.json`);
/** @type {{ cloudName: string, photos: { id: string, file: string, width: number, height: number, takenAt: string | null }[] }} */
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : { cloudName: CLOUDINARY_CLOUD_NAME, photos: [] };
const known = new Set(manifest.photos.map((p) => p.file));

const files = fs
  .readdirSync(folder)
  .filter((f) => !f.startsWith(".") && IMAGE_EXT.has(path.extname(f).toLowerCase()))
  .sort();
const todo = files.filter((f) => !known.has(f));
console.log(`${files.length} foto në dosje, ${files.length - todo.length} tashmë të ngarkuara, ${todo.length} për t'u ngarkuar.`);

/** Emër i sigurt për URL: "WhatsApp Image (1).jpeg" → "whatsapp-image-1". */
function publicIdFor(file) {
  const base = path
    .basename(file, path.extname(file))
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `arkivi/${slug}/${base}`;
}

/** EXIF "2026:10:17 19:42:10" → ISO, për renditjen sipas kohës së fotografimit. */
function takenAtFrom(metadata) {
  const raw = metadata?.DateTimeOriginal ?? metadata?.CreateDate;
  const m = typeof raw === "string" && raw.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}` : null;
}

async function uploadOne(file) {
  const options = {
    public_id: publicIdFor(file),
    overwrite: true,
    resource_type: "image",
    image_metadata: true,
    // Ruaj max. 2400 px: mjafton për pamjen e madhe dhe kursen hapësirë.
    transformation: [{ width: 2400, height: 2400, crop: "limit" }],
  };
  try {
    return await cloudinary.uploader.upload(path.join(folder, file), options);
  } catch {
    // Një provë e dytë për gabime të rastësishme rrjeti.
    return await cloudinary.uploader.upload(path.join(folder, file), options);
  }
}

const started = Date.now();
let done = 0;
let failed = 0;
const queue = [...todo];

async function worker() {
  for (let file = queue.shift(); file; file = queue.shift()) {
    try {
      const r = await uploadOne(file);
      manifest.photos.push({
        id: r.public_id,
        file,
        width: r.width,
        height: r.height,
        takenAt: takenAtFrom(r.image_metadata),
      });
      done += 1;
    } catch (err) {
      failed += 1;
      console.error(`\nDështoi: ${file} – ${err?.error?.message ?? err?.message ?? err}`);
    }
    process.stdout.write(`\r${done + failed}/${todo.length} (${failed} gabime)`);
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker));

// Renditja: sipas kohës së fotografimit; fotot pa EXIF (p.sh. WhatsApp) në fund, sipas emrit.
manifest.photos.sort((a, b) => {
  if (a.takenAt && b.takenAt) return a.takenAt.localeCompare(b.takenAt) || a.file.localeCompare(b.file);
  if (a.takenAt) return -1;
  if (b.takenAt) return 1;
  return a.file.localeCompare(b.file);
});
manifest.cloudName = CLOUDINARY_CLOUD_NAME;
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const secs = Math.round((Date.now() - started) / 1000);
console.log(`\nGati në ${secs}s: ${done} të ngarkuara, ${failed} gabime. Lista: ${path.relative(root, manifestPath)}`);
if (failed > 0) {
  console.log("Ekzekuto komandën sërish për të provuar përsëri fotot që dështuan.");
  process.exitCode = 1;
}
