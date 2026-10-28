"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";

import { garden as G, du } from "@/content/intro";

/**
 * CỔNG BÌNH PHONG — màn mở thiệp dạng tranh be vàng.
 *
 * Lúc chưa mở: dải ren đứng giữa tranh che gần hết mặt trời (chỉ nhô một
 * lưỡi mỏng ra bên phải), tán tre bên trái đung đưa, chưa có bướm. Khách bấm
 * nút → mặt trời trượt ra khỏi dải ren, lộ dần từ trái sang phải; hai con bướm
 * từ mép phải bay vào, lượn quanh mặt trời. Đến nhịp `reveal` thì hero hiện
 * lên bên dưới và tranh tan đi, còn bướm bay tiếp ngang qua hero rồi mới khuất.
 *
 * Vì sao là DOM + GSAP chứ không phải canvas (như cổng Huế cũ): ở đây chỉ có
 * năm tấm ảnh phẳng, không có lớp ánh sáng cộng `screen` hay mask động, nên
 * thẻ <img> và transform là đủ nhẹ, và bướm cần sống ngoài tranh để bay tiếp
 * qua hero — canvas thì bị cắt theo khung của nó.
 *
 * Tranh phủ kín khung (cover) trên máy hẹp hơn 9:16, nên mọi thứ nằm trong một
 * "sân khấu" 475 × 844 đơn vị thiết kế đặt giữa màn hình và co theo chiều cao
 * (`--iu`, xem content/intro.ts). Hai bên sân khấu bị cắt trên máy hẹp; trên máy
 * rộng sân khấu đứng giữa, hai bên là màu giấy.
 *
 * Mặt trời nằm SAU dải ren: lớp "khung che" là chính ảnh nền, cắt từ mép trái
 * tới `screenEdge`, vẽ lại đè lên mặt trời — nên mặt trời không bao giờ cần mask.
 *
 * Bất kỳ phần tử con nào gắn `data-garden-cta` sẽ lui đi ngay khi bấm (nút và
 * dòng "chạm để mở"); phần còn lại của chữ ở yên cho tới khi tranh tan.
 */

const { stage, sun: SUN, bamboo: BAM, butterflies: BUT, timings: T, images, dir } = G;

/** Trượt bao nhiêu % bề ngang CHÍNH mặt trời để từ chỗ ẩn về chỗ đã mở. */
const SUN_SHIFT = (SUN.hidden / SUN.width) * 100;

/** Số ảnh phải tải xong trước khi cho bấm (mỗi ảnh một lần, không tính bản cắt lại). */
const MUST_LOAD = 5;
/** Chờ tối đa bấy nhiêu ms rồi cho bấm luôn, để một ảnh chậm không chặn cả thiệp. */
const READY_TIMEOUT = 4000;

const src = (name: string) => `${dir}/${name}`;

/** Elip đặc ở gốc thân rồi tan dần — phần thân tre đứng yên, xem `bamboo.stem`. */
const stemMask = `radial-gradient(ellipse ${BAM.stem.rx}% ${BAM.stem.ry}% at ${BAM.stem.x}% ${BAM.stem.y}%, #000 55%, transparent 100%)`;

type Props = {
  /** Lật sang true là chạy chuỗi mở. Chỉ chạy đúng một lần. */
  open: boolean;
  /** Tranh đã tải đủ — màn mở thiệp dùng để mở khoá nút. */
  onReady: () => void;
  /** Hero nên bắt đầu hiện ra — lúc này tranh vẫn còn đó. */
  onReveal: () => void;
  /** Bướm đã bay khuất, có thể gỡ cả màn khỏi DOM. */
  onFinished: () => void;
  /** Chữ, ấn, nút — đặt vào hệ toạ độ 475 × 844 của sân khấu. */
  children: ReactNode;
};

type Wings = { flight: HTMLDivElement | null; fly: HTMLDivElement | null };

export function Garden({ open, onReady, onReveal, onFinished, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const flockStageRef = useRef<HTMLDivElement>(null);
  const flightRefs = useRef<Record<"ivory" | "olive", Wings>>({
    ivory: { flight: null, fly: null },
    olive: { flight: null, fly: null },
  });

  /* Handler mới mỗi lần render, nhưng chuỗi mở chỉ dựng một lần — đọc qua ref. */
  const handlers = useRef({ onReady, onReveal, onFinished });
  useEffect(() => {
    handlers.current = { onReady, onReveal, onFinished };
  });

  /* ------------------------------------------------------------- TẢI ẢNH */

  const loaded = useRef(0);
  const readyFired = useRef(false);
  const fireReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    handlers.current.onReady();
  }, []);
  /* Lỗi cũng tính là xong: thiếu một ảnh trang trí không được khoá nút mở thiệp. */
  const markLoaded = useCallback(() => {
    loaded.current += 1;
    if (loaded.current >= MUST_LOAD) fireReady();
  }, [fireReady]);

  useEffect(() => {
    const timer = window.setTimeout(fireReady, READY_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [fireReady]);

  /* --------------------------------------------------------- CHUỖI MỞ */

  useEffect(() => {
    if (!open) return;

    const root = rootRef.current;
    const scene = sceneRef.current;
    const sunEl = sunRef.current;
    const flockStage = flockStageRef.current;
    if (!root || !scene || !sunEl || !flockStage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctas = root.querySelectorAll("[data-garden-cta]");
    const reveal = () => handlers.current.onReveal();
    const timeline = gsap.timeline({ onComplete: () => handlers.current.onFinished() });

    // Ai tắt hiệu ứng thì mặt trời về thẳng chỗ đã mở, không có bướm, rồi sang hero.
    if (reduce) {
      gsap.set(sunEl, { xPercent: SUN_SHIFT });
      timeline
        .to(ctas, { autoAlpha: 0, duration: 0.25 }, 0)
        .call(reveal, undefined, 0.3)
        .set(root, { pointerEvents: "none" }, 0.3)
        .to(scene, { opacity: 0, duration: 0.45 }, 0.3);
      return () => {
        timeline.kill();
      };
    }

    // Bướm đo theo SÂN KHẤU chứ không theo màn hình, để đường bay co cùng tranh.
    const { width: W, height: H } = flockStage.getBoundingClientRect();

    timeline
      .to(ctas, { autoAlpha: 0, duration: T.cta[1] - T.cta[0], ease: "power2.out" }, T.cta[0])
      /* Mặt trời trượt ra khỏi dải ren: mép dải ren đứng yên nên phần lộ ra
         lớn dần từ trái sang phải. */
      .to(
        sunEl,
        { xPercent: SUN_SHIFT, duration: T.sun[1] - T.sun[0], ease: "power2.inOut" },
        T.sun[0],
      );

    for (const key of ["ivory", "olive"] as const) {
      const { flight, fly } = flightRefs.current[key];
      const path = G.flight[key];
      if (!flight || !fly) continue;

      const [t0, x0, y0, r0] = path[0];
      // Mốc đầu nằm ngoài mép phải màn hình: đặt sẵn, rồi mới cho hiện.
      timeline
        .set(flight, { x: x0 * W, y: y0 * H, autoAlpha: 1 }, Math.max(0, t0 - 0.05))
        .set(fly, { rotation: r0 }, Math.max(0, t0 - 0.05))
        .call(() => fly.setAttribute("data-flying", ""), undefined, Math.max(0, t0 - 0.05));

      for (let i = 1; i < path.length; i++) {
        const [t, dx, dy, rot] = path[i];
        const from = path[i - 1][0];
        const vars = { duration: t - from, ease: "sine.inOut" };
        timeline.to(flight, { x: dx * W, y: dy * H, ...vars }, from);
        timeline.to(fly, { rotation: rot, ...vars }, from);
      }
    }

    /* Hero hiện lên BÊN DƯỚI trước khi tranh tan — hai cảnh chồng nhau một
       nhịp nên không có cú cắt, và trang mở khoá cuộn từ đây. Bướm nằm ngoài
       `scene` nên không tan theo, bay tiếp qua hero. */
    timeline
      .call(reveal, undefined, T.reveal)
      .set(root, { pointerEvents: "none" }, T.reveal)
      .to(scene, { opacity: 0, duration: T.fade, ease: "power2.inOut" }, T.reveal);

    return () => {
      timeline.kill();
    };
  }, [open]);

  /* ------------------------------------------------------------ DỰNG CẢNH */

  const stageClass = "absolute inset-y-0 left-1/2 -translate-x-1/2";
  const stageStyle: CSSProperties = { width: du(stage.w) };

  const butterfly = (key: "ivory" | "olive") => {
    const b = BUT[key];
    return (
      <div
        key={key}
        ref={(node) => {
          flightRefs.current[key].flight = node;
        }}
        className="absolute"
        style={{
          left: `${b.left}%`,
          top: `${b.top}%`,
          width: `${b.width}%`,
          aspectRatio: "3 / 2",
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <div
          ref={(node) => {
            flightRefs.current[key].fly = node;
          }}
          className="butterfly inset-0 size-full"
          style={{ "--flap": `${b.flap}s` } as CSSProperties}
        >
          {(["butterfly-wing-left", "butterfly-wing-right", "butterfly-body"] as const).map(
            (part, i) => (
              <Image
                key={part}
                src={src(images[key])}
                alt=""
                width={360}
                height={240}
                unoptimized
                loading="eager"
                draggable={false}
                className={part}
                onLoad={i === 0 ? markLoaded : undefined}
                onError={i === 0 ? markLoaded : undefined}
              />
            ),
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={rootRef} className="absolute inset-0 [container-type:size]">
      {/* --iu: một đơn vị thiết kế = chiều cao màn hình / 844. Phải đặt ở phần
          tử CON của container thì cqh mới quy chiếu về container. */}
      <div className="absolute inset-0" style={{ "--iu": "calc(100cqh / 844)" } as CSSProperties}>
        <div ref={sceneRef} className="absolute inset-0 overflow-hidden bg-tone-bg">
          {/* Cắt theo sân khấu: trên máy rộng hơn 9:16, tán tre (gốc ở -7%)
              không được thò ra vùng giấy trống hai bên. */}
          <div className={`${stageClass} overflow-hidden`} style={stageStyle}>
            <div aria-hidden className="absolute inset-0">
              <Image
                src={src(images.background)}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-fill"
                onLoad={markLoaded}
                onError={markLoaded}
              />

              <div
                ref={sunRef}
                className="absolute will-change-transform"
                style={{
                  left: `${SUN.left - SUN.hidden}%`,
                  top: `${SUN.top}%`,
                  width: `${SUN.width}%`,
                  aspectRatio: "1",
                }}
              >
                <Image
                  src={src(images.sun)}
                  alt=""
                  width={800}
                  height={800}
                  unoptimized
                  loading="eager"
                  draggable={false}
                  className="size-full [clip-path:circle(48%_at_50%_50%)]"
                  onLoad={markLoaded}
                  onError={markLoaded}
                />
              </div>

              {/* Khung che: chính ảnh nền, cắt từ mép trái tới mép dải ren, đè
                  lên mặt trời nên mặt trời trượt "ra từ sau" dải ren. */}
              <Image
                src={src(images.background)}
                alt=""
                fill
                unoptimized
                loading="eager"
                sizes="100vw"
                className="object-fill"
                style={{ clipPath: `inset(0 ${100 - G.screenEdge}% 0 0)` }}
              />

              {/* Tre: cùng một ảnh vẽ hai lần. Lớp dưới là cả cây, lá lay nhẹ quanh
                  gốc; lớp trên chỉ giữ phần gốc thân (mask elip tan dần) đứng yên
                  đè lên, nên thân cây không rung mà lá thì có. */}
              <div
                className="absolute"
                style={{
                  left: `${BAM.left}%`,
                  top: `${BAM.top}%`,
                  width: `${BAM.width}%`,
                  aspectRatio: "3 / 2",
                }}
              >
                <Image
                  src={src(images.bamboo)}
                  alt=""
                  width={1200}
                  height={800}
                  unoptimized
                  loading="eager"
                  draggable={false}
                  className="animate-sway-soft size-full"
                  style={{ transformOrigin: BAM.origin }}
                  onLoad={markLoaded}
                  onError={markLoaded}
                />
                <Image
                  src={src(images.bamboo)}
                  alt=""
                  width={1200}
                  height={800}
                  unoptimized
                  loading="eager"
                  draggable={false}
                  className="absolute inset-0 size-full"
                  style={{ maskImage: stemMask, WebkitMaskImage: stemMask }}
                />
              </div>
            </div>

            {/* Chữ, ấn, nút của thiệp */}
            {children}
          </div>
        </div>

        {/* Bướm nằm NGOÀI `scene`: tranh tan đi mà bướm vẫn bay tiếp qua hero. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div ref={flockStageRef} className={stageClass} style={stageStyle}>
            {butterfly("ivory")}
            {butterfly("olive")}
          </div>
        </div>
      </div>
    </div>
  );
}
