"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getPosts, type PostListItem } from "@/src/lib/api";

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            我的博客
          </Link>
          <Link
            href="/admin"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            后台管理
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">最新文章</h2>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                <div className="mb-2 h-4 w-full rounded bg-gray-100" />
                <div className="mb-4 h-4 w-2/3 rounded bg-gray-100" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 rounded bg-gray-100" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchPosts}
              className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              重试
            </button>
          </div>
        )}

        {/* Post grid */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                  {post.summary || "暂无摘要"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  {post.category_name ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600">
                      {post.category_name}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <p className="py-20 text-center text-gray-400">暂无文章</p>
        )}
      </main>
    </div>
  );
}
