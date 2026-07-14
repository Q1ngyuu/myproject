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

  if (!loading && notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500">文章不存在</p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          返回列表
        </Link>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchPost}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mb-2 flex gap-3">
            <div className="h-5 w-16 rounded-full bg-gray-100" />
            <div className="h-5 w-32 rounded bg-gray-100" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <article className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {post!.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {post!.category_name && (
              <span className="rounded-full bg-blue-50 px-3 py-0.5 font-medium text-blue-600">
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
          <div className="prose prose-gray max-w-none leading-relaxed text-gray-700 whitespace-pre-wrap">
            {post!.content}
          </div>
        </article>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            ← 返回列表
          </Link>
        </div>
      </main>
    </div>
  );
}
