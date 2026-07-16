"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  interval?: number; // ms, default 5000
}

export default function Carousel({ images, interval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const len = images.length;
  if (len === 0) return null;

  // ── Auto-play ──
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [len, interval, isHovered]);

  // ── Navigate ──
  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + len) % len);
    },
    [len]
  );

  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);
  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);

  // ── Keyboard ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Slides ── */}
      <div className="relative aspect-[21/9] w-full bg-gray-900">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`风景照 ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        ))}

        {/* ── Gradient overlays ── */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/35 hover:scale-110 group-hover:opacity-100 sm:opacity-0"
        style={{ opacity: isHovered ? 1 : 0 }}
        aria-label="上一张"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/35 hover:scale-110 sm:opacity-0"
        style={{ opacity: isHovered ? 1 : 0 }}
        aria-label="下一张"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* ── Counter badge ── */}
      <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
        {current + 1} / {len}
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-2.5 w-8 bg-white shadow-md"
                : "h-2.5 w-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`第 ${i + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
