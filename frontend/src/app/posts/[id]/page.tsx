"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPost, type PostDetail } from "@/lib/api";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getPost(Number(id));
      setPost(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load post";
      if (msg === "Post not found") {
        setNotFound(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // ── 404 ──
  if (!loading && notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <span className="text-7xl">🔍</span>
        <h1 className="text-2xl font-bold text-gray-400">404</h1>
        <p className="text-gray-500">文章不存在或已被删除</p>
        <Link
          href="/"
          className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
        >
          ← 返回首页
        </Link>
      </div>
    );
  }

  // ── Error ──
  if (!loading && error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchPost}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
        >
          重试
        </button>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Navbar skeleton */}
        <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-4 h-8 w-2/3 rounded-md bg-gray-200" />
            <div className="mb-2 flex gap-3">
              <div className="h-6 w-16 rounded-full bg-gray-100" />
              <div className="h-6 w-32 rounded-md bg-gray-100" />
            </div>
            <div className="mt-8 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded-md bg-gray-100" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Post content ──
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-base shadow-md shadow-indigo-500/20">
              ✍️
            </span>
            <span className="gradient-text">我的博客</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 transition-colors duration-300 hover:text-indigo-600"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <article className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/50">
          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
            {post!.title}
          </h1>

          {/* Meta row */}
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {post!.category_name && (
              <span className="whitespace-nowrap rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {post!.category_name}
              </span>
            )}
            <span>
              {new Date(post!.created_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

          {/* Content */}
          <div className="prose prose-gray max-w-none leading-relaxed text-gray-700 whitespace-pre-wrap">
            {post!.content}
          </div>
        </article>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
          >
            ← 返回列表
          </Link>
        </div>
      </main>
    </div>
  );
}
