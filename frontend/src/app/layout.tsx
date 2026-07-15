import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "我的博客 — 记录技术与生活",
  description: "一个简洁优雅的个人博客系统，分享技术文章与生活随笔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
