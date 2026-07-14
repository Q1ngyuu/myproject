import axios from "axios";

// --- Types ---

export interface PostListItem {
  id: number;
  title: string;
  summary: string | null;
  category_name: string | null;
  created_at: string;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  category_id: number | null;
  category_name: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  summary?: string;
  category_id?: number;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  summary?: string;
  category_id?: number;
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// --- Axios instance ---

const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// --- Error handling ---

async function request<T>(fn: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await fn();
    if (res.data.code !== 0) {
      throw new Error(res.data.message || "API error");
    }
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }
    throw err;
  }
}

// --- Posts API ---

export async function getPosts(): Promise<PostListItem[]> {
  return request(() => api.get("/api/posts"));
}

export async function getPost(id: number): Promise<PostDetail> {
  return request(() => api.get(`/api/posts/${id}`));
}

export async function createPost(data: CreatePostInput): Promise<PostDetail> {
  return request(() => api.post("/api/posts", data));
}

export async function updatePost(id: number, data: UpdatePostInput): Promise<PostDetail> {
  return request(() => api.put(`/api/posts/${id}`, data));
}

export async function deletePost(id: number): Promise<void> {
  return request(() => api.delete(`/api/posts/${id}`));
}

// --- Categories API ---

export async function getCategories(): Promise<Category[]> {
  return request(() => api.get("/api/categories"));
}
