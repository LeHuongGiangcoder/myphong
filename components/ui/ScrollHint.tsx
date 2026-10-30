"use client";

import { useEffect, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";

/** Chờ bao lâu sau khi hero hiện ra thì mới nhắc cuộn. */
const DELAY_MS = 4500;
/** Cuộn quá ngưỡng này (px) là khách đã biết cuộn — gỡ gợi ý đi. */
const DONE_AT = 40;

/**
 * Gợi ý "cuộn xuống" cho khách lớn tuổi, nằm cố định ở chân màn hình. Chỉ hiện
 * khi hero đã mở khoá cuộn, khách ở đầu trang và đã đứng yên vài giây; cuộn một
 * chút là biến mất, và không quay lại.
 */
export function ScrollHint({ label }: { label: string }) {
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
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-opacity duration-700 ease-glow ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-tight rounded-full border border-brass bg-ivory px-stack py-tight text-bark shadow-paper">
        <span className="font-body text-small font-medium">{label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bob"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
