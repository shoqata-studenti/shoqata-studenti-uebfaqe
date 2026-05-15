#!/usr/bin/env node
/**
 * Converts a MySQL dump (db.sql) to PostgreSQL INSERTs for Neon (neon_import.sql).
 *
 * Usage:
 *   node scripts/mysql-dump-to-neon-import.mjs [path/to/db.sql] [path/to/neon_import.sql]
 *
 * Defaults: ./db.sql → ./neon_import.sql
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = path.resolve(root, process.argv[2] ?? "db.sql");
const outputPath = path.resolve(root, process.argv[3] ?? "neon_import.sql");

const HEADER = `-- neon_import.sql — PostgreSQL INSERTs for Prisma/Neon
-- Generated from MySQL dump: ${path.basename(inputPath)}
-- Run on empty schema: psql "$DATABASE_URL" -f neon_import.sql
-- Then reset sequences (see footer).

`;

const FOOTER = `
-- Reset serial sequences after explicit IDs
SELECT setval(pg_get_serial_sequence('"Member"', 'id'), COALESCE((SELECT MAX(id) FROM "Member"), 1), (SELECT COUNT(*) > 0 FROM "Member"));
SELECT setval(pg_get_serial_sequence('"Post"', 'id'), COALESCE((SELECT MAX(id) FROM "Post"), 1), (SELECT COUNT(*) > 0 FROM "Post"));
SELECT setval(pg_get_serial_sequence('"VargjetTopic"', 'id'), COALESCE((SELECT MAX(id) FROM "VargjetTopic"), 1), (SELECT COUNT(*) > 0 FROM "VargjetTopic"));
SELECT setval(pg_get_serial_sequence('"VargjetDocument"', 'id'), COALESCE((SELECT MAX(id) FROM "VargjetDocument"), 1), (SELECT COUNT(*) > 0 FROM "VargjetDocument"));
SELECT setval(pg_get_serial_sequence('"EventGalleryImage"', 'id'), COALESCE((SELECT MAX(id) FROM "EventGalleryImage"), 1), (SELECT COUNT(*) > 0 FROM "EventGalleryImage"));
`;

/** Strip block comments and line comments outside strings (best-effort). */
function stripSqlComments(sql) {
  let out = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1];

    if (!inSingle && !inDouble && !inBacktick && c === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      continue;
    }
    if (!inSingle && !inDouble && !inBacktick && c === "/" && next === "*") {
      i += 2;
      while (i < sql.length && !(sql[i] === "*" && sql[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    if (!inDouble && !inBacktick && c === "'" && !inSingle) inSingle = true;
    else if (inSingle && c === "'" && next === "'") {
      out += "''";
      i += 2;
      continue;
    } else if (inSingle && c === "'") inSingle = false;
    else if (!inSingle && !inBacktick && c === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble && c === "`") inBacktick = !inBacktick;

    if (!inSingle && !inDouble && !inBacktick) {
      out += c === "`" ? '"' : c;
    } else {
      out += c;
    }
    i++;
  }
  return out;
}

/** Extract complete INSERT ... ; statements. */
function extractInserts(sql) {
  const cleaned = stripSqlComments(sql);
  const inserts = [];
  const re = /\bINSERT\s+INTO\s+/gi;
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    let i = m.index;
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let stmt = "";
    for (; i < cleaned.length; i++) {
      const c = cleaned[i];
      const next = cleaned[i + 1];
      stmt += c;

      if (!inDouble && c === "'" && !inSingle) inSingle = true;
      else if (inSingle && c === "'" && next === "'") {
        stmt += next;
        i++;
        continue;
      } else if (inSingle && c === "'") inSingle = false;
      else if (!inSingle && c === '"') inDouble = !inDouble;
      else if (!inSingle && !inDouble) {
        if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === ";" && depth === 0) {
          inserts.push(stmt.trim());
          break;
        }
      }
    }
  }
  return inserts;
}

/** Convert MySQL string escapes inside a single-quoted literal to Postgres. */
function mysqlStringToPg(inner) {
  return inner
    .replace(/\\'/g, "''")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

/** Walk VALUES clause and fix literals (hex blobs, escapes, bit/boolean). */
function convertValuesClause(valuesPart) {
  let out = "";
  let i = 0;
  const s = valuesPart;

  while (i < s.length) {
  const rest = s.slice(i);
  const hexMatch = rest.match(/^0x([0-9A-Fa-f]+)/);
  if (hexMatch) {
    out += `'\\x${hexMatch[1].toLowerCase()}'`;
    i += hexMatch[0].length;
    continue;
  }
  const xHex = rest.match(/^X'([0-9A-Fa-f]+)'/i);
  if (xHex) {
    out += `'\\x${xHex[1].toLowerCase()}'`;
    i += xHex[0].length;
    continue;
  }
  const bPrefix = rest.match(/^b'([^']*)'/i);
  if (bPrefix) {
    const bytes = Buffer.from(bPrefix[1], "binary");
    out += `'\\x${bytes.toString("hex")}'`;
    i += bPrefix[0].length;
    continue;
  }
  if (rest[i] === "'" || (i === 0 && rest[0] === "'")) {
    let j = i + 1;
    let inner = "";
    while (j < s.length) {
      if (s[j] === "\\" && j + 1 < s.length) {
        inner += s[j] + s[j + 1];
        j += 2;
        continue;
      }
      if (s[j] === "'" && s[j + 1] === "'") {
        inner += "''";
        j += 2;
        continue;
      }
      if (s[j] === "'") break;
      inner += s[j];
      j++;
    }
    const converted = mysqlStringToPg(inner.replace(/''/g, "\u0000").replace(/\u0000/g, "''"));
    out += `'${converted.replace(/'/g, "''")}'`;
    i = j + 1;
    continue;
  }
  out += s[i];
  i++;
  }
  return out;
}

function convertInsertStatement(stmt) {
  const upper = stmt.toUpperCase();
  if (!upper.startsWith("INSERT INTO")) return null;

  const valuesIdx = stmt.toUpperCase().indexOf(" VALUES");
  if (valuesIdx === -1) return stmt.replace(/`/g, '"') + ";";

  const head = stmt.slice(0, valuesIdx).replace(/`/g, '"');
  const tail = stmt.slice(valuesIdx + " VALUES".length);
  const body = convertValuesClause(tail);
  return `${head} VALUES${body}`;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    console.error("Place your MySQL dump as db.sql in the project root, or pass a path.");
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf8");
  const inserts = extractInserts(raw);
  if (inserts.length === 0) {
    console.error("No INSERT INTO statements found in dump.");
    process.exit(1);
  }

  const lines = [HEADER.trimEnd(), ""];
  for (const stmt of inserts) {
    const converted = convertInsertStatement(stmt.replace(/;\s*$/, ""));
    if (converted) lines.push(converted.endsWith(";") ? converted : `${converted};`);
    lines.push("");
  }
  lines.push(FOOTER.trim());

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
  console.log(`Wrote ${inserts.length} INSERT statement(s) to ${outputPath}`);
}

main();
