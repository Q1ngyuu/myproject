"use client";

import PageTransition from "./PageTransition";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
