"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { getPosts, type PostListItem } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import Carousel from "@/components/Carousel";

// ── Carousel images ──
const CAROUSEL_IMAGES = [
  "/pictures/19f4815b536e7e2592ff4ea45df5e57d.jpg",
  "/pictures/c93121ba9839303c657e1ef5479a353c.jpg",
  "/pictures/3573f6c9a926b125943739cdb3bbbd00.JPG",
  "/pictures/f9beaa1389e8beb34de39452d3f1948a.JPG",
  "/pictures/c443663b7d64fac98c24961456762862.JPG",
  "/pictures/cb0ba67533a406d600d729639dce08d7.jpg",
  "/pictures/b13d3f0d20b82aa08c4d268015235355.jpg",
  "/pictures/c216996af9cce8f8fb097088cdb25cef.jpg",
];

// ── Stagger animation variants ──

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("homeSearchQuery") || "";
    }
    return "";
  });
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("homePage");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 6;
  const mainRef = useRef<HTMLElement>(null);

  const fetchPosts = useCallback(async (q?: string, p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(q, p, PAGE_SIZE);
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Restore previous page & fetch ──
  useEffect(() => {
    fetchPosts(searchQuery || undefined, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scroll past carousel when returning from detail page ──
  useEffect(() => {
    if (!loading && mainRef.current) {
      const shouldScroll = sessionStorage.getItem("scrollPastCarousel");
      if (shouldScroll) {
        requestAnimationFrame(() => {
          mainRef.current?.scrollIntoView({ behavior: "instant" });
        });
      }
    }
  }, [loading]);

  // ── Persist page & search query for back-navigation ──
  useEffect(() => {
    sessionStorage.setItem("homePage", String(page));
    sessionStorage.setItem("homeSearchQuery", searchQuery);
  }, [page, searchQuery]);

  const handleSearch = useCallback(
    (q: string) => {
      setSearchQuery(q);
      setPage(1);
      fetchPosts(q || undefined, 1);
    },
    [fetchPosts]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      fetchPosts(searchQuery || undefined, p);
    },
    [fetchPosts, searchQuery]
  );

  return (
    <div className="min-h-screen">
      {/* Navbar — glassmorphism + gradient accent */}
      <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 text-xl font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-base shadow-md shadow-indigo-500/20">
              ✍️
            </span>
            <span className="hidden sm:inline gradient-text">我的博客</span>
          </Link>

          <SearchBar onSearch={handleSearch} />

          <Link
            href="/admin"
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
          >
            后台管理
          </Link>
        </div>
      </header>

      {/* ── Carousel ── */}
      <Carousel images={CAROUSEL_IMAGES} interval={5000} />

      {/* Main */}
      <main ref={mainRef} className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {searchQuery ? "搜索结果" : "最新文章"}
          </h2>
          <p className="mt-2 text-base text-gray-500">
            {searchQuery
              ? `找到 ${total} 篇与「${searchQuery}」相关的文章`
              : "记录技术、生活与思考 ✨"}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && <SkeletonCard variant="list-item" count={5} />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
            >
              重试
            </button>
          </div>
        )}

        {/* Post list */}
        {!loading && !error && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50"
          >
            <div className="divide-y divide-gray-50">
              {posts.map((post) => (
                <motion.div key={post.id} variants={item}>
                  <Link
                    href={`/posts/${post.id}`}
                    onClick={() => sessionStorage.setItem("scrollPastCarousel", "true")}
                    className="group relative flex items-start justify-between gap-6 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-blue-50/40 hover:shadow-md"
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && posts.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Empty / No results */}
        {!loading && !error && posts.length === 0 && (
          searchQuery ? (
            <EmptyState
              icon="🔍"
              title="未找到相关文章"
              description={`没有找到与「${searchQuery}」相关的文章，请尝试其他关键词`}
            />
          ) : (
            <EmptyState
              icon="📝"
              title="还没有文章"
              description="暂时还没有发布任何文章，快去后台创作第一篇吧"
              action={{ label: "去创作", href: "/admin" }}
            />
          )
        )}
      </main>
    </div>
  );
}
