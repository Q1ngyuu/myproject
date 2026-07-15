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

// --- Schema ---

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  summary: z.string().optional(),
  category_id: z.string().min(1, "请选择分类"),
});

type PostFormData = z.infer<typeof postSchema>;

// --- Component ---

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

  // --- Form ---
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", summary: "", category_id: "" },
  });

  // --- Data fetching ---
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

  // --- Modal helpers ---
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

  // --- Submit ---
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

  // --- Delete ---
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

  // --- Loading ---
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 rounded-md bg-gray-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // --- Error ---
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

  // --- Main ---
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
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

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            后台管理
          </h1>
          <button
            onClick={openCreateModal}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
          >
            + 新建文章
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">标题</th>
                <th className="px-6 py-3.5">分类</th>
                <th className="px-6 py-3.5">创建时间</th>
                <th className="px-6 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-blue-50/30"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {post.id}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 font-medium text-gray-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    {post.category_name && (
                      <span className="whitespace-nowrap rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                        {post.category_name}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs">
                    {new Date(post.created_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(post.id)}
                      className="mr-3 text-indigo-600 transition-all duration-200 hover:text-indigo-800 hover:underline"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="text-red-500 transition-all duration-200 hover:text-red-700 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="py-12 text-center text-gray-400">暂无文章</p>
          )}
        </div>
      </main>

      {/* --- Modal --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-gray-400/30">
            {/* Modal header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b bg-gradient-to-r from-indigo-50/50 to-blue-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "编辑文章" : "✨ 新建文章"}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  标题 <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="文章标题"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  内容 <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("content")}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="文章内容"
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  摘要
                </label>
                <textarea
                  {...register("summary")}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="文章摘要（可选）"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  分类 <span className="text-red-400">*</span>
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

              {/* Modal footer */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? "保存中..." : editingId ? "保存更改" : "创建文章"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirm Dialog --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                ⚠️
              </span>
              <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              确定要删除 <span className="font-medium text-gray-700">&ldquo;{deleteTarget.title}&rdquo;</span> 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/25 transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {deleting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
