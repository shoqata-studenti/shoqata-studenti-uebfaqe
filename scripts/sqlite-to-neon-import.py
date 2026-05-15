#!/usr/bin/env python3
"""
Export prisma/dev.db → neon_import.sql (PostgreSQL INSERTs for Neon).
Used when db.sql is missing; same Prisma table/column names as Postgres schema.
"""
from __future__ import annotations

import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SQLITE_PATH = ROOT / "prisma" / "dev.db"
OUT_PATH = ROOT / "neon_import.sql"

TABLES_ORDER = [
    "Member",
    "Post",
    "VargjetTopic",
    "VargjetDocument",
    "EventGalleryImage",
]

BLOB_COLUMNS = {
    "Post": {"imageData"},
    "VargjetDocument": {"fileData"},
    "EventGalleryImage": {"fileData"},
}

DATETIME_COLUMNS = {
    "Member": {"joinedAt", "expiresAt", "lastRenewalAt"},
    "Post": {"createdAt", "eventAt"},
    "VargjetTopic": {"createdAt"},
    "VargjetDocument": {"createdAt"},
    "EventGalleryImage": {"createdAt"},
}


def pg_ident(name: str) -> str:
    return f'"{name}"'


def pg_string(val: str) -> str:
    return "'" + val.replace("'", "''") + "'"


def pg_bytea(blob: bytes) -> str:
    return f"'\\x{blob.hex()}'"


def format_datetime(val) -> str:
    if val is None:
        return "NULL"
    if isinstance(val, (int, float)):
        ts = val / 1000.0 if val > 1e12 else float(val)
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return pg_string(dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3])
    s = str(val).strip()
    if s.isdigit():
        ts = int(s) / 1000.0 if len(s) > 10 else int(s)
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return pg_string(dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3])
    if "T" in s and not s.endswith("Z"):
        s = s.replace("T", " ")[:23]
    return pg_string(s)


def format_value(table: str, col: str, val) -> str:
    if val is None:
        return "NULL"
    if col in BLOB_COLUMNS.get(table, set()):
        if isinstance(val, memoryview):
            val = val.tobytes()
        if isinstance(val, bytes):
            return pg_bytea(val)
        return "NULL"
    if col in DATETIME_COLUMNS.get(table, set()):
        return format_datetime(val)
    if isinstance(val, int):
        return str(val)
    if isinstance(val, float):
        return str(val)
    return pg_string(str(val))


def split_full_name(full: str) -> tuple[str, str]:
    t = (full or "").strip()
    if not t:
        return "", ""
    i = t.find(" ")
    if i == -1:
        return t, ""
    return t[:i].strip(), t[i + 1 :].strip()


def export_member_rows(conn: sqlite3.Connection) -> list[str]:
    cur = conn.execute('SELECT * FROM "Member" ORDER BY id')
    sqlite_cols = [d[0] for d in cur.description]
    pg_cols = [
        "id",
        "email",
        "name",
        "surname",
        "uni",
        "studium",
        "type",
        "status",
        "stripeId",
        "joinedAt",
        "expiresAt",
        "lastRenewalAt",
    ]
    col_list = ", ".join(pg_ident(c) for c in pg_cols)
    lines: list[str] = []
    for row in cur.fetchall():
        data = dict(zip(sqlite_cols, row))
        full = str(data.get("name") or "")
        stored_surname = str(data.get("surname") or "").strip() if "surname" in data else ""
        if stored_surname:
            name = full.strip()
            surname = stored_surname
        else:
            name, surname = split_full_name(full)
        row_out = {**data, "name": name, "surname": surname}
        values = ", ".join(format_value("Member", c, row_out.get(c)) for c in pg_cols)
        lines.append(f'INSERT INTO {pg_ident("Member")} ({col_list}) VALUES ({values});')
    return lines


def export_table(conn: sqlite3.Connection, table: str) -> list[str]:
    if table == "Member":
        return export_member_rows(conn)
    cur = conn.execute(f'SELECT * FROM "{table}" ORDER BY id')
    cols = [d[0] for d in cur.description]
    col_list = ", ".join(pg_ident(c) for c in cols)
    lines: list[str] = []
    rows = cur.fetchall()
    if not rows:
        return lines
    for row in rows:
        values = ", ".join(format_value(table, cols[i], row[i]) for i in range(len(cols)))
        lines.append(f'INSERT INTO {pg_ident(table)} ({col_list}) VALUES ({values});')
    return lines


def main() -> int:
    out = sys.argv[1] if len(sys.argv) > 1 else str(OUT_PATH)
    db = sys.argv[2] if len(sys.argv) > 2 else str(SQLITE_PATH)
    if not Path(db).is_file():
        print(f"SQLite DB not found: {db}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(db)
    parts = [
        "-- neon_import.sql — PostgreSQL INSERTs for Prisma/Neon",
        f"-- Source: SQLite export from {Path(db).name}",
        "-- Run: psql \"$DATABASE_URL\" -f neon_import.sql",
        "",
    ]

    for table in TABLES_ORDER:
        stmts = export_table(conn, table)
        if stmts:
            parts.append(f"-- {table}")
            parts.extend(stmts)
            parts.append("")

    parts.append(
        """-- Reset serial sequences after explicit IDs
SELECT setval(pg_get_serial_sequence('"Member"', 'id'), COALESCE((SELECT MAX(id) FROM "Member"), 1), (SELECT COUNT(*) > 0 FROM "Member"));
SELECT setval(pg_get_serial_sequence('"Post"', 'id'), COALESCE((SELECT MAX(id) FROM "Post"), 1), (SELECT COUNT(*) > 0 FROM "Post"));
SELECT setval(pg_get_serial_sequence('"VargjetTopic"', 'id'), COALESCE((SELECT MAX(id) FROM "VargjetTopic"), 1), (SELECT COUNT(*) > 0 FROM "VargjetTopic"));
SELECT setval(pg_get_serial_sequence('"VargjetDocument"', 'id'), COALESCE((SELECT MAX(id) FROM "VargjetDocument"), 1), (SELECT COUNT(*) > 0 FROM "VargjetDocument"));
SELECT setval(pg_get_serial_sequence('"EventGalleryImage"', 'id'), COALESCE((SELECT MAX(id) FROM "EventGalleryImage"), 1), (SELECT COUNT(*) > 0 FROM "EventGalleryImage"));
"""
    )
    conn.close()

    Path(out).write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
