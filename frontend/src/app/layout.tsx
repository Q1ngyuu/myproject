import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog System",
  description: "A simple blog system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
