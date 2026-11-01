"use client";

import { useEffect } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";

/** Chờ bao lâu sau khi hero hiện ra thì mới nhích trang. */
const DELAY_MS = 2200;
/** Trang nhích lên bao nhiêu px rồi trở về. */
const NUDGE_PX = 64;
const UP_MS = 650;
const DOWN_MS = 800;

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

/**
 * Gợi ý "kéo xuống" cho khách lớn tuổi: không có chữ nào đè lên ảnh, chỉ là cả
 * trang nhích lên một chút rồi hạ về, như thể bên dưới còn nội dung. Chạy đúng
 * một lần, khi hero đã mở khoá cuộn và khách còn đứng ở đầu trang; khách chạm
 * hay cuộn trước đó thì thôi. `prefers-reduced-motion` thì bỏ qua.
 */
export function ScrollHint() {
  const { opened } = useExperience();

  useEffect(() => {
    if (!opened) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    const tween = (from: number, to: number, ms: number, done?: () => void) => {
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const p = Math.min((now - start) / ms, 1);
        window.scrollTo(0, from + (to - from) * easeInOut(p));
        if (p < 1) frame = requestAnimationFrame(step);
        else done?.();
      };
      frame = requestAnimationFrame(step);
    };

    const timer = window.setTimeout(() => {
      if (window.scrollY > 1) return;
      tween(0, NUDGE_PX, UP_MS, () => tween(NUDGE_PX, 0, DOWN_MS));
    }, DELAY_MS);

    // Khách tự chạm / cuộn thì nhường tay họ ngay.
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      cancel();
      events.forEach((e) => window.removeEventListener(e, cancel));
    };
  }, [opened]);

  return null;
}
