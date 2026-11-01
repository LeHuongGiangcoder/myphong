"use client";

import { useEffect, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";

/** Chờ bao lâu sau khi hero hiện ra thì mới hiện gợi ý. */
const DELAY_MS = 2200;
/** Cuộn quá ngưỡng này (px) là khách đã biết cuộn — gỡ gợi ý đi. */
const DONE_AT = 40;

/**
 * Gợi ý "kéo xuống" cho khách lớn tuổi: một nét kẻ mảnh có mũi tên nhỏ ở chân
 * màn hình, nhấp nhô nhẹ, không có chữ nên không che ảnh. Chỉ hiện khi hero đã
 * mở khoá cuộn và khách còn ở đầu trang; cuộn một chút là biến mất, không quay lại.
 */
export function ScrollHint() {
  const { opened } = useExperience();
  const [waited, setWaited] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setWaited(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [opened]);

  useEffect(() => {
    if (scrolled) return;
    const onScroll = () => {
      if (window.scrollY > DONE_AT) setScrolled(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const shown = opened && waited && !scrolled;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] text-tone-fg transition-opacity duration-700 ease-glow ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex animate-bob flex-col items-center">
        <span className="block h-5 w-px bg-current" />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-mt-1.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
