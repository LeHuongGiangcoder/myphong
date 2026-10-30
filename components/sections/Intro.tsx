"use client";

import { useCallback, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { useLocale } from "@/components/experience/LocaleProvider";
import { Garden } from "@/components/ui/Garden";
import { Seal } from "@/components/ui/Seal";
import { design, intro } from "@/content/client";
import { garden, du } from "@/content/intro";

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
          className="absolute m-0 whitespace-nowrap font-body font-medium uppercase text-tone-contrast"
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

        {/* Nút mở thiệp + dòng gợi ý */}
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
        <p
          data-garden-cta
          aria-hidden
          className="absolute m-0 text-center font-display italic text-tone-fg"
          style={{ left: du(L.tap.x), top: du(L.tap.y), width: du(L.tap.w), fontSize: du(L.tap.size) }}
        >
          {t(intro.tap)}
        </p>

        {/* Cột phải trên nền giấy: tên hai người + lời mời */}
        <div
          className="absolute flex flex-col items-start"
          style={{ left: du(names.x), top: du(names.y), width: du(names.w) }}
        >
          <p
            className="m-0 font-body font-medium uppercase text-tone-muted"
            style={{ fontSize: du(names.label.size), letterSpacing: `${names.label.ls}em` }}
          >
            {t(intro.eyebrow)}
          </p>
          <p
            className="m-0 font-display font-medium italic text-tone-fg"
            style={{ marginTop: du(names.gap.label), fontSize: du(names.name.size), lineHeight: 1.02 }}
          >
            <span className="block">{t(intro.names.groom)}</span>
            <span className="block font-light" style={{ fontSize: du(names.name.amp) }}>
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
            className="m-0 font-body font-medium uppercase text-tone-muted"
            style={{
              marginTop: du(names.invite.gap),
              fontSize: du(names.label.size),
              letterSpacing: `${names.label.ls}em`,
            }}
          >
            {t(intro.inviteLabel)}
          </p>
          <p
            className="m-0 font-display font-medium italic text-tone-fg"
            style={{
              marginTop: du(names.gap.guest),
              fontSize: du(names.invite.size),
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
