type SkeletonVariant = "list-item" | "article" | "table-row" | "stat-card";

interface SkeletonCardProps {
  variant?: SkeletonVariant;
  /** Repeat count — renders N copies wrapped in appropriate containers */
  count?: number;
  /** Extra CSS classes */
  className?: string;
}

export default function SkeletonCard({
  variant = "list-item",
  count = 1,
  className = "",
}: SkeletonCardProps) {
  const items = Array.from({ length: count });

  // ── List item (homepage row) ──
  if (variant === "list-item") {
    return (
      <>
        {count === 1 ? (
          <SingleListItem className={className} />
        ) : (
          <div
            className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg ${className}`}
          >
            <div className="divide-y divide-gray-50">
              {items.map((_, i) => (
                <SingleListItem key={i} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Article detail skeleton ──
  if (variant === "article") {
    return (
      <div className={className}>
        {/* Navbar skeleton */}
        <div className="sticky top-0 z-10 border-b border-indigo-100/60 bg-white/75 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Article card skeleton */}
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg sm:p-10">
            {/* Title */}
            <div className="mb-6 space-y-3">
              <div className="h-9 w-3/4 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-9 w-1/2 animate-pulse rounded-lg bg-gray-200" />
            </div>
            {/* Meta */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
            </div>
            {/* Divider */}
            <div className="mb-10 h-px bg-gray-100" />
            {/* Paragraphs */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded-md bg-gray-100"
                  style={{ width: `${85 - i * 8}%` }}
                />
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded-md bg-gray-100"
                  style={{ width: `${90 - i * 6}%` }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Table row skeleton ──
  if (variant === "table-row") {
    return (
      <>
        {items.map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4">
              <div className="h-4 w-8 rounded bg-gray-200" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-48 rounded bg-gray-200" />
            </td>
            <td className="px-6 py-4">
              <div className="h-5 w-12 rounded-full bg-gray-200" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-20 rounded bg-gray-200" />
            </td>
            <td className="px-6 py-4">
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </td>
          </tr>
        ))}
      </>
    );
  }

  // ── Stat card skeleton ──
  if (variant === "stat-card") {
    return (
      <div
        className={`animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
      >
        <div className="mb-2 h-3 w-14 rounded bg-gray-200" />
        <div className="flex items-end justify-between">
          <div className="h-8 w-10 rounded bg-gray-200" />
          <div className="h-6 w-6 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return null;
}

// ── Helpers ──

function SingleListItem({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse px-6 py-5 ${className}`}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-2.5">
          <div className="h-5 w-1/2 rounded-md bg-gray-200" />
          <div className="h-4 w-full rounded-md bg-gray-100" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="h-5 w-14 rounded-full bg-gray-100" />
          <div className="h-4 w-20 rounded-md bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
