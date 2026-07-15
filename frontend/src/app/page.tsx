"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getPosts, type PostListItem } from "@/lib/api";

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
          <div className="divide-y rounded-xl border bg-white shadow-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-100" />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="h-4 w-14 rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </div>
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

        {/* Post list */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="divide-y">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex items-start justify-between gap-4 px-6 py-5 transition hover:bg-blue-50/40"
                >
                  {/* 左侧：标题 + 摘要 */}
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 text-base font-semibold text-gray-900 transition group-hover:text-blue-600">
                      {post.title}
                    </h3>
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {post.summary || "暂无摘要"}
                    </p>
                  </div>

                  {/* 右侧：分类 + 日期 */}
                  <div className="flex shrink-0 items-center gap-3 pt-0.5 text-xs text-gray-400">
                    {post.category_name ? (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600">
                        {post.category_name}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
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
