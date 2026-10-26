"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { useLocale } from "@/components/experience/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Gateway } from "@/components/ui/Gateway";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { couple, design, intro } from "@/content/client";
import { background as resolveBackground } from "@/lib/assets";

/**
 * Màn mở thiệp. Nằm phủ kín màn hình, giữ trang khoá cuộn cho tới khi khách
 * bấm "Mở thiệp" — chính cú chạm đó bật nhạc (xem ExperienceProvider).
 *
 * Hai kiểu, chọn bằng `design.intro.gateway` trong content/client.ts:
 *
 *   gateway: true   cảnh cổng Huế động. Bấm nút → cửa mở trong ~4,8 giây →
 *                   cảnh đẩy qua ô cửa → hero hiện lên bên dưới rồi lớp cổng
 *                   tan đi. Màn này SỐNG THÊM một nhịp sau khi hero hiện ra,
 *                   chính nhịp chồng nhau đó làm chỗ nối không thấy cú cắt.
 *   gateway: false  nền ảnh tĩnh, bấm là vào thẳng hero (kiểu của khung nền).
 *
 * Vì vậy `opened` của ExperienceProvider KHÔNG còn quyết định lúc nào gỡ màn
 * này đi — `phase` ở đây mới là cái quyết định.
 */
export function Intro() {
  const { open, reveal } = useExperience();
  const { t } = useLocale();

  const [phase, setPhase] = useState<"idle" | "opening" | "gone">("idle");
  /* Cảnh cổng phải tải đủ layer mới cho bấm, nếu không cửa sẽ nhảy cóc. */
  const [gateReady, setGateReady] = useState(false);
  const [gateFailed, setGateFailed] = useState(false);

  const spec = design.intro;
  const useGate = (spec.gateway ?? false) && !gateFailed;

  const onFail = useCallback(() => setGateFailed(true), []);
  const onReady = useCallback(() => setGateReady(true), []);
  const onFinished = useCallback(() => setPhase("gone"), []);

  const handleOpen = useCallback(() => {
    if (phase !== "idle") return;
    // Nhạc phải play() ngay trong cú chạm, trước mọi thứ khác.
    open();
    if (useGate) {
      setPhase("opening");
      return;
    }
    reveal();
    setPhase("gone");
  }, [phase, open, reveal, useGate]);

  if (phase === "gone") return null;

  const invitation = (
    <>
      <Eyebrow>{t(intro.eyebrow)}</Eyebrow>

      <Heading level="h1" className="flex flex-col items-center short:text-h2">
        <span>{couple.groom}</span>
        <span className="font-script text-h2 text-tone-accent">&amp;</span>
        <span>{couple.bride}</span>
      </Heading>

      <Divider diamond />

      <p className="font-script text-h3">{t(intro.note)}</p>

      <Button
        onClick={handleOpen}
        disabled={useGate && !gateReady}
        className="mt-stack"
        aria-describedby={useGate ? "intro-hint" : undefined}
      >
        {t(intro.cta)}
      </Button>
    </>
  );

  const dialog = {
    "data-tone": spec.tone,
    role: "dialog" as const,
    "aria-modal": true,
    "aria-label": t(intro.eyebrow),
  };

  if (useGate) {
    return (
      <div {...dialog} className="fixed inset-0 z-40 bg-night text-tone-fg">
        <Gateway
          open={phase === "opening"}
          onReady={onReady}
          onFail={onFail}
          onReveal={reveal}
          onFinished={onFinished}
        >
          {/* Chữ nằm ở phần dưới, trên mặt nước — chừa trọn ô cửa cho ánh sáng.
              Dải tối chân màn chỉ để chữ đọc được, không phải để làm mờ cảnh. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-night via-night/70 to-transparent"
          />
          <div className="absolute inset-0 flex flex-col justify-end pb-section">
            <div className="container-prose flex flex-col items-center gap-stack text-center">
              {invitation}
              <p id="intro-hint" className="sr-only">
                {t(intro.hint)}
              </p>
            </div>
          </div>
        </Gateway>
      </div>
    );
  }

  const background = resolveBackground(spec.background);

  return (
    <div
      {...dialog}
      className="fixed inset-0 z-40 flex items-center justify-center bg-tone-bg text-tone-fg"
    >
      {background ? (
        <>
          <Image src={background.src} alt="" fill sizes="100vw" priority className="object-cover" />
          <div
            aria-hidden
            className="absolute inset-0 bg-tone-bg"
            style={{ opacity: spec.overlay ?? 0.55 }}
          />
        </>
      ) : null}

      <div className="container-prose relative flex flex-col items-center gap-stack text-center">
        {invitation}
      </div>
    </div>
  );
}
