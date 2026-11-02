"use client";

import { useCallback, useEffect, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { useLocale } from "@/components/experience/LocaleProvider";
import { Garden } from "@/components/ui/Garden";
import { Seal } from "@/components/ui/Seal";
import { design, intro } from "@/content/client";
import { garden, du, fitText, roomRight } from "@/content/intro";

const L = garden.layout;

/**
 * Màn mở thiệp: cổng Bình phong. Nằm phủ kín màn hình, giữ trang khoá cuộn
 * cho tới khi khách bấm "Mở thiệp" — chính cú chạm đó bật nhạc (xem
 * ExperienceProvider).
 *
 * Bấm nút → mặt trời lộ ra, bướm bay vào (xem components/ui/Garden.tsx) →
 * hero hiện lên bên dưới rồi tranh tan đi. Màn này SỐNG THÊM một nhịp sau khi
 * hero hiện ra, và bướm còn bay tiếp qua hero, nên `opened` của
 * ExperienceProvider KHÔNG quyết định lúc nào gỡ màn này đi — `phase` ở đây mới
 * là cái quyết định.
 *
 * Thiệp chung cho mọi khách nên người nhận luôn là "Quý khách" (`intro.guest`),
 * không tra tên từ `?to=`. Cổng Huế cũ nằm ở archive/hue-gateway.
 *
 * Mọi vị trí và cỡ chữ ở đây đọc từ `garden.layout` (content/intro.ts), tính
 * bằng đơn vị thiết kế rồi `du()` quy ra theo chiều cao màn hình — chữ phải
 * dính đúng vào hoạ tiết của tranh nên không dùng được spacing của theme.
 */
export function Intro() {
  const { open, reveal } = useExperience();
  const { t } = useLocale();

  const [phase, setPhase] = useState<"idle" | "opening" | "gone">("idle");
  /* Tranh phải tải đủ ảnh mới cho bấm, nếu không mặt trời sẽ nhảy cóc. */
  const [ready, setReady] = useState(false);
  /* Hiện mũi tên gợi ý sau 1.5s khi vào màn intro */
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onFinished = useCallback(() => setPhase("gone"), []);

  const handleOpen = useCallback(() => {
    if (phase !== "idle") return;
    // Nhạc phải play() ngay trong cú chạm, trước mọi thứ khác.
    open();
    setPhase("opening");
  }, [phase, open]);

  if (phase === "gone") return null;

  const { names } = L;

  return (
    <div
      data-tone={design.intro.tone}
      role="dialog"
      aria-modal="true"
      aria-label={t(intro.eyebrow)}
      className="fixed inset-0 z-40 text-tone-fg"
    >
      <Garden open={phase === "opening"} onReady={onReady} onReveal={reveal} onFinished={onFinished}>
        {/* Dải nâu bên trái: vạch đứng + dòng chữ dọc */}
        <span
          aria-hidden
          className="absolute bg-bark/45"
          style={{ left: du(L.rule.x), top: du(L.rule.y), width: "1px", height: du(L.rule.h) }}
        />
        <p
          className="absolute m-0 whitespace-nowrap font-display font-semibold uppercase text-tone-contrast"
          style={{
            left: du(L.vertical.x),
            top: du(L.vertical.y),
            height: du(12),
            lineHeight: du(12),
            fontSize: du(L.vertical.size),
            letterSpacing: `${L.vertical.ls}em`,
            transformOrigin: "0 0",
            transform: "rotate(-90deg)",
          }}
        >
          {t(intro.vertical)}
        </p>

        {/* Ấn 囍 trên dải ren */}
        <div
          className="absolute"
          style={{ left: du(L.seal.x - L.seal.ring), top: du(L.seal.y - L.seal.ring) }}
        >
          <Seal size={du(L.seal.size)} glyph={du(L.seal.glyph)} ring={du(L.seal.ring)} />
        </div>

        {/* Nút mở thiệp */}
        <button
          type="button"
          data-garden-cta
          onClick={handleOpen}
          disabled={!ready}
          aria-describedby="intro-hint"
          className="absolute flex items-center justify-center border border-brass bg-tone-fg font-body font-semibold uppercase text-ivory shadow-paper transition-[opacity,background-color] duration-200 ease-glow disabled:opacity-55 hover:[@media(hover:hover)]:bg-tone-accent"
          style={{
            left: du(L.cta.x),
            top: du(L.cta.y),
            width: du(L.cta.w),
            height: du(L.cta.h),
            fontSize: du(L.cta.size),
            letterSpacing: `${L.cta.ls}em`,
          }}
        >
          {t(intro.cta)}
        </button>

        {/* Mũi tên gợi ý bấm nút — uốn cong từ góc trên phải trỏ xuống nút */}
        <div
          aria-hidden
          data-garden-cta
          className={`intro-hint-arrow absolute pointer-events-none transition-opacity duration-700 ease-out ${
            showArrow && phase === "idle"
              ? "opacity-100 intro-hint-nudge"
              : "opacity-0"
          }`}
          style={{
            left: du(L.cta.x + L.cta.w - 18),
            top: du(L.cta.y - 34),
          }}
        >
          <svg
            width={du(38)}
            height={du(38)}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Thân mũi tên cong mềm mại */}
            <path
              d="M35 4 C 36 16, 26 28, 12 30"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Đầu mũi tên hình tam giác cánh én sắc nét */}
            <path
              d="M5 33 L14 25 C 12 28.5, 11.5 30.5, 11 35 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Cột phải trên nền giấy: tên hai người + lời mời */}
        <div
          className="absolute flex flex-col items-start"
          style={{ left: du(names.x), top: du(names.y), width: `min(${du(names.w)}, ${roomRight(names.x)})` }}
        >
          <p
            className="m-0 w-full text-center font-display font-semibold uppercase text-tone-muted"
            style={{ fontSize: fitText(names.label.size, names.x, 11.5), letterSpacing: `${names.label.ls}em` }}
          >
            {t(intro.eyebrow)}
          </p>
          <p
            className="m-0 w-full text-center font-display font-medium italic text-tone-fg"
            style={{ marginTop: du(names.gap.label), fontSize: fitText(names.name.size, names.x, 5), lineHeight: 1.02 }}
          >
            <span className="block whitespace-nowrap">{t(intro.names.groom)}</span>
            <span
              className="block text-center font-light"
              style={{ margin: `${du(names.name.amp)} 0` }}
            >
              &amp;
            </span>
            <span className="block whitespace-nowrap">{t(intro.names.bride)}</span>
          </p>
          <span
            aria-hidden
            className="block bg-brass"
            style={{ marginTop: du(names.rule.gap), width: du(names.rule.w), height: "1px" }}
          />
          <p
            className="m-0 font-display font-medium italic text-tone-fg"
            style={{ marginTop: du(names.invite.gap), fontSize: fitText(names.invite.label, names.x, 4), lineHeight: 1.15 }}
          >
            {t(intro.inviteLabel)}
          </p>
          <p
            className="m-0 font-display font-medium italic text-tone-fg"
            style={{
              marginTop: du(names.gap.guest),
              fontSize: fitText(names.invite.size, names.x, 4),
              lineHeight: 1.15,
            }}
          >
            {t(intro.guest)}
          </p>
        </div>
      </Garden>

      <p id="intro-hint" className="sr-only">
        {t(intro.hint)}
      </p>
    </div>
  );
}
