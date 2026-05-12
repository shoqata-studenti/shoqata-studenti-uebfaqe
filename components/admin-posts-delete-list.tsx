"use client";

import * as React from "react";

export type AdminPostListRow = {
  id: number;
  title: string;
  createdAt: string;
};

type Props = {
  initialPosts: AdminPostListRow[];
};

export function AdminPostsDeleteList({ initialPosts }: Props) {
  const [posts, setPosts] = React.useState(initialPosts);
  const [pendingId, setPendingId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleDelete(id: number) {
    setError(null);
    setPendingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        return;
      }
      if (res.status === 401) {
        window.location.href = "/admin/login?next=/admin/posts";
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : `HTTP ${res.status}`);
    } catch {
      setError("Rrjeti dështoi.");
    } finally {
      setPendingId(null);
    }
  }

  if (posts.length === 0) {
    return <p className="mt-6 text-sm text-black/55">Ende nuk ka poste në databazë.</p>;
  }

  return (
    <div className="mt-6">
      {error ? (
        <p className="mb-4 rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-2 text-sm text-black">
          {error}
        </p>
      ) : null}
      <ul className="space-y-3">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-black/12 bg-black/[0.02] px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-black/50">
                #{p.id} ·{" "}
                {new Date(p.createdAt).toLocaleString("sq-AL", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-black">{p.title}</p>
            </div>
            <button
              type="button"
              disabled={pendingId === p.id}
              onClick={() => void handleDelete(p.id)}
              className="inline-flex min-h-9 items-center justify-center rounded-sm border border-[#E11D48]/50 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-[#E11D48] transition-colors hover:bg-[#E11D48]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pendingId === p.id ? "…" : "Fshi"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
