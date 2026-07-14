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
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-full rounded bg-gray-100" />
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
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          重试
        </button>
      </div>
    );
  }

  // --- Main ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            我的博客
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-gray-900"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">后台管理</h1>
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + 新建文章
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">标题</th>
                <th className="px-6 py-3">分类</th>
                <th className="px-6 py-3">创建时间</th>
                <th className="px-6 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-600">
              {posts.map((post) => (
                <tr key={post.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {post.id}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 font-medium text-gray-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    {post.category_name && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                        {post.category_name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(post.created_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(post.id)}
                      className="mr-3 text-blue-600 transition hover:text-blue-800"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="text-red-500 transition hover:text-red-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "编辑文章" : "新建文章"}
              </h2>
              <button
                onClick={closeModal}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                  placeholder="文章标题"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content")}
                  rows={5}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                  placeholder="文章内容"
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  摘要
                </label>
                <textarea
                  {...register("summary")}
                  rows={2}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                  placeholder="文章摘要（可选）"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  分类 <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category_id")}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
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
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">确认删除</h3>
            <p className="mb-6 text-sm text-gray-500">
              确定要删除文章 &ldquo;{deleteTarget.title}&rdquo; 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
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
