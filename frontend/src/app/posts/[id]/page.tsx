"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getPost, getPosts, type PostDetail, type PostListItem } from "@/lib/api";
import SkeletonCard from "@/components/SkeletonCard";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherPosts, setOtherPosts] = useState<PostListItem[]>([]);

  // ── Reading progress ──
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [notFoundPost, setNotFoundPost] = useState(false);

  // ── Fetch post ──
  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFoundPost(false);
    try {
      const data = await getPost(Number(id));
      setPost(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load post";
      if (msg === "Post not found") {
        setNotFoundPost(true);
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

  // Fetch other posts for sidebar
  useEffect(() => {
    getPosts(undefined, 1, 20)
      .then((data) => setOtherPosts(data.posts.filter((p) => p.id !== Number(id))))
      .catch(() => {});
  }, [id]);

  // ── 404 ──
  if (!loading && notFoundPost) {
    notFound();
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
    return <SkeletonCard variant="article" />;
  }

  // ── Post content ──
  return (
    <div className="min-h-screen">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 z-20 h-1 rounded-r-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold text-gray-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-base shadow-md shadow-indigo-500/20">
              ✍️
            </span>
            <span className="gradient-text">我的博客</span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors duration-300 hover:text-indigo-600"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            返回首页
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* ── Left: Article content ── */}
          <div className="min-w-0 flex-1">
            <article className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/50 sm:p-10">
              {/* Title */}
              <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl sm:leading-tight">
                {post!.title}
              </h1>

              {/* Meta row */}
              <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
                {/* Category badge */}
                {post!.category_name && (
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600">
                    📂 {post!.category_name}
                  </span>
                )}

                {/* Divider dot */}
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block" />

                {/* Date with calendar icon */}
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-400">
                  📅{" "}
                  {new Date(post!.created_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Decorative divider */}
              <div className="mb-10 h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

              {/* Article body — Markdown rendered with prose */}
              <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:text-rose-600 prose-pre:rounded-xl prose-pre:bg-gray-900 prose-pre:shadow-lg prose-img:rounded-xl">
                <ReactMarkdown>{post!.content}</ReactMarkdown>
              </div>
            </article>

            {/* Back button */}
            <div className="mt-10 text-center">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
              >
                <span className="text-base transition-transform duration-300 group-hover:-translate-x-1.5">
                  ←
                </span>
                返回列表
              </Link>
            </div>
          </div>

          {/* ── Right: Sidebar — other articles ── */}
          {otherPosts.length > 0 && (
            <aside className="w-full shrink-0 lg:w-72">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50">
                <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-gray-900">
                  <span>📝</span>
                  <span>其他文章</span>
                </h3>
                <ul className="space-y-1">
                  {otherPosts.slice(0, 8).map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/posts/${p.id}`}
                        className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-600"
                      >
                        {/* Left accent bar */}
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 transition-colors duration-200 group-hover:bg-indigo-500" />
                        <span className="line-clamp-1 leading-relaxed">
                          {p.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {otherPosts.length > 8 && (
                  <Link
                    href="/"
                    className="mt-4 flex items-center justify-center gap-1 rounded-lg py-2 text-xs text-gray-400 transition-colors hover:text-indigo-600"
                  >
                    查看更多 →
                  </Link>
                )}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
