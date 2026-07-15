"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getPosts,
  getPost,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  type PostListItem,
  type Category,
} from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";

// ── Schema ──

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  summary: z.string().optional(),
  category_id: z.string().min(1, "请选择分类"),
});

type PostFormData = z.infer<typeof postSchema>;

// ── Category color map ──

function getCategoryColor(name: string): string {
  const map: Record<string, string> = {
    "技术": "bg-blue-50 text-blue-700 border-blue-200",
    "生活": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "随笔": "bg-purple-50 text-purple-700 border-purple-200",
  };
  return map[name] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

// ── Component ──

export default function AdminPage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<PostListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Form ──
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", summary: "", category_id: "" },
  });

  // ── Data fetching ──
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getPosts(),
        getCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Modal helpers ──
  const openCreateModal = () => {
    setEditingId(null);
    reset({ title: "", content: "", summary: "", category_id: "" });
    setModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    try {
      const post = await getPost(id);
      setEditingId(id);
      reset({
        title: post.title,
        content: post.content,
        summary: post.summary || "",
        category_id: String(post.category_id ?? ""),
      });
      setModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load post");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  // ── Submit ──
  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    setSubmitting(true);
    try {
      const payload = { ...data, category_id: Number(data.category_id) };
      if (editingId) {
        await updatePost(editingId, payload);
      } else {
        await createPost(payload);
      }
      closeModal();
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard variant="stat-card" count={3} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80">
                  {["w-8", "w-12", "w-10", "w-16", "w-10"].map((w, i) => (
                    <th key={i} className="px-6 py-3.5">
                      <div className={`h-3 ${w} animate-pulse rounded bg-gray-200`} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <SkeletonCard variant="table-row" count={5} />
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
        >
          重试
        </button>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-lg">
              📋
            </span>
            文章管理
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            管理博客文章，创建、编辑或删除内容
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total posts */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
              文章总数
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {posts.length}
              </span>
              <span className="text-2xl">📝</span>
            </div>
          </div>

          {/* Total categories */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
              分类总数
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {categories.length}
              </span>
              <span className="text-2xl">🏷️</span>
            </div>
          </div>

          {/* Quick action */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              快捷操作
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
            >
              <span className="text-base">+</span>
              新建文章
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {posts.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="w-16 px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">标题</th>
                  <th className="w-24 px-6 py-3.5">分类</th>
                  <th className="w-28 px-6 py-3.5">创建时间</th>
                  <th className="w-36 px-6 py-3.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post, idx) => (
                  <tr
                    key={post.id}
                    className={`transition-colors hover:bg-indigo-50/30 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-400">
                        #{post.id}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="max-w-xs truncate px-6 py-4 font-medium text-gray-900">
                      {post.title}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {post.category_name ? (
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryColor(post.category_name)}`}
                        >
                          {post.category_name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString("zh-CN")}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(post.id)}
                        className="mr-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        ✏️ 编辑
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                      >
                        🗑️ 删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Empty state */
            <EmptyState
              icon="📭"
              title="还没有文章"
              description="点击上方「新建文章」按钮，开始创作你的第一篇文章"
              action={{ label: "+ 创建第一篇文章", onClick: openCreateModal }}
            />
          )}
        </div>
      </main>

      {/* ── Modal overlay ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="animate-fade-in-up w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-gray-400/30"
            style={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b bg-gradient-to-r from-indigo-50/60 to-blue-50/60 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                {editingId ? (
                  <>✏️ 编辑文章</>
                ) : (
                  <>✨ 新建文章</>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/80 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                  标题
                  <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="请输入文章标题"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                  内容
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("content")}
                  rows={6}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="支持 Markdown 语法，使用 ## 创建标题，``` 创建代码块"
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  摘要
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (可选)
                  </span>
                </label>
                <textarea
                  {...register("summary")}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="简短描述文章内容，将显示在文章列表中"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                  分类
                  <span className="text-red-400">*</span>
                </label>
                <select
                  {...register("category_id")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">请选择分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      保存中...
                    </>
                  ) : editingId ? (
                    "保存更改"
                  ) : (
                    "创建文章"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirm dialog ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="animate-fade-in-up w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            style={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                ⚠️
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
                <p className="text-xs text-gray-400">此操作不可撤销</p>
              </div>
            </div>
            <p className="mb-6 rounded-lg bg-red-50/50 px-4 py-3 text-sm leading-relaxed text-gray-600">
              确定要删除文章{" "}
              <span className="font-semibold text-gray-900">
                「{deleteTarget.title}」
              </span>{" "}
              吗？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/25 transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {deleting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    删除中...
                  </>
                ) : (
                  "确认删除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared Navbar ──

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
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
          className="text-sm text-gray-500 transition-colors duration-300 hover:text-indigo-600"
        >
          ← 返回首页
        </Link>
      </div>
    </header>
  );
}
