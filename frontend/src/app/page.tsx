"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getPosts, type PostListItem } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";

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
    <div className="min-h-screen">
      {/* Navbar — glassmorphism + gradient accent */}
      <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-base shadow-md shadow-indigo-500/20">
              ✍️
            </span>
            <span className="gradient-text">我的博客</span>
          </Link>
          <Link
            href="/admin"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
          >
            后台管理
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            最新文章
          </h2>
          <p className="mt-2 text-base text-gray-500">
            记录技术、生活与思考 ✨
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && <SkeletonCard variant="list-item" count={5} />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchPosts}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
            >
              重试
            </button>
          </div>
        )}

        {/* Post list */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50">
            <div className="divide-y divide-gray-50">
              {posts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="animate-fade-in-up group relative flex items-start justify-between gap-6 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-blue-50/40 hover:shadow-md"
                  style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
                >
                  {/* Hover accent bar */}
                  <span className="absolute inset-y-2.5 left-0 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />

                  {/* Left: title + summary */}
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                      {post.title}
                    </h3>
                    <p className="line-clamp-1 text-sm leading-relaxed text-gray-500">
                      {post.summary || "暂无摘要"}
                    </p>
                  </div>

                  {/* Right: category + date */}
                  <div className="flex shrink-0 items-center gap-4 pt-0.5">
                    {post.category_name ? (
                      <span className="whitespace-nowrap rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {post.category_name}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="whitespace-nowrap text-xs text-gray-400">
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
          <EmptyState
            icon="📝"
            title="还没有文章"
            description="暂时还没有发布任何文章，快去后台创作第一篇吧"
            action={{ label: "去创作", href: "/admin" }}
          />
        )}
      </main>
    </div>
  );
}
