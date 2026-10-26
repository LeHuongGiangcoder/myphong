"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

import { gateway as scene } from "@/content/gateway";

/**
 * CỔNG HUẾ — màn mở thiệp dạng cảnh động.
 *
 * Khách bấm nút → hai cánh cửa tách ra, ánh vàng thoát ra, mây toả từ chân
 * cổng, dòng sáng chảy dần xuống tiền cảnh. Hết chuỗi thì cảnh phóng tới ô
 * cửa, ánh sáng trào ra, hero hiện lên bên dưới rồi lớp cổng tan đi.
 *
 * VÌ SAO LÀ CANVAS CHỨ KHÔNG PHẢI 11 THẺ <img> CHỒNG NHAU:
 *
 *   • Mấy lớp ánh sáng phải cộng theo kiểu `screen`, và dòng sáng trên sông
 *     cần một mask mềm chạy xuống từng khung hình. Làm bằng DOM là 11 lớp
 *     mix-blend-mode + mask động — máy điện thoại tầm trung tụt khung ngay.
 *   • Guide của bộ asset yêu cầu cả cảnh dùng CHUNG một phép biến hình. Một
 *     canvas duy nhất bảo đảm điều đó; 11 thẻ ảnh với `object-fit` riêng thì
 *     chỉ cần lệch một pixel là hở khe sáng ở mép cửa.
 *
 * Toàn bộ nét vẽ nằm trong hệ toạ độ 1080 × 1920 của bức tranh (xem
 * content/gateway.ts). Backing buffer của canvas có thể nhỏ hơn thế trên máy
 * yếu — `setTransform` lo phần quy đổi, nên code vẽ không cần biết.
 *
 * Đây là component bespoke của site này. Muốn dùng cho khách khác thì cần bộ
 * asset dựng theo cùng cách (xem brand/hue-gateway-intro/ANIMATION-GUIDE-VI.md).
 */

const { canvas: C, aperture: AP, door, timings: T, intensity, handoff: HO } = scene;

/** Tỉ lệ khung hình của tranh, dùng để tính phần hiển thị thật trên màn hình. */
const RATIO = C.w / C.h;

/** Màn hẹp hơn 9:16 thì phủ kín (cắt hai bên), rộng hơn thì thu gọn cả trần cổng. */
const COVER_QUERY = "(max-aspect-ratio: 9/16)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Lên/xuống mượt hai đầu, dùng cho mọi lớp fade theo mốc thời gian. */
function ramp(t: number, [from, to]: readonly [number, number]) {
  const p = clamp01((t - from) / (to - from));
  return p * p * (3 - 2 * p);
}

/** Ease in-out cubic — nhịp của hai cánh cửa: nặng ở đầu, trôi ở cuối, không nảy. */
function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

type Props = {
  /** Lật sang true là chạy chuỗi mở cửa. Chỉ chạy đúng một lần. */
  open: boolean;
  /** Gọi khi hero nên bắt đầu hiện ra — lúc này lớp cổng vẫn còn đó. */
  onReveal: () => void;
  /** Gọi khi lớp cổng đã tan hết, có thể gỡ khỏi DOM. */
  onFinished: () => void;
  /** Tải đủ layer chưa — màn mở thiệp dùng để mở khoá nút. */
  onReady: () => void;
  /** Thiếu layer thì báo ra để màn mở thiệp quay về nền tĩnh. */
  onFail: () => void;
  /** Chữ và nút của màn mở thiệp, đặt đè lên cảnh. */
  children: ReactNode;
};

export function Gateway({ open, onReveal, onFinished, onReady, onFail, children }: Props) {
  /* Callback đi qua ref: màn mở thiệp render lại giữa chừng cũng không làm
     effect chạy lại — nếu không, chuỗi mở cửa sẽ bị dựng lại từ đầu. */
  const handlers = useRef({ onReveal, onFinished, onReady, onFail });
  useEffect(() => {
    handlers.current = { onReveal, onFinished, onReady, onFail };
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  /** Canvas phụ: dựng dòng sáng đã cắt mask rồi mới cộng vào cảnh chính. */
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  /** Backing buffer / 1080 — 1 là vẽ đúng khổ gốc, nhỏ hơn là đã giảm tải. */
  const scaleRef = useRef(1);
  /** Giây hiện tại của chuỗi, giữ lại để vẽ lại đúng khung khi đổi cỡ màn. */
  const timeRef = useRef(0);

  /* ------------------------------------------------------------- VẼ CẢNH */

  const draw = useCallback((t: number) => {
    const ctx = ctxRef.current;
    const img = imagesRef.current;
    if (!ctx || !img.base) return;

    timeRef.current = t;
    const s = scaleRef.current;

    const paint = (
      source: CanvasImageSource,
      alpha = 1,
      blend: GlobalCompositeOperation = "source-over",
      dx = 0,
      dy = 0,
    ) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = blend;
      ctx.drawImage(source, dx, dy, C.w, C.h);
      ctx.restore();
    };

    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, C.w, C.h);
    paint(img.base);

    if (t <= 0) return;

    /* Cửa. Cắt vào đúng ô cửa nên hai cánh khuất sau trụ, không trượt lên núi,
       và cảnh bên trong lộ ra tự nhiên qua khe thay vì fade đè lên cánh. */
    const opened = easeInOutCubic(clamp01((t - T.doors[0]) / (T.doors[1] - T.doors[0])));
    ctx.save();
    ctx.beginPath();
    ctx.rect(AP.x, AP.y, AP.w, AP.h);
    ctx.clip();
    ctx.drawImage(img.interior, 0, 0, C.w, C.h);
    ctx.drawImage(img.left, AP.x - door.left * opened, AP.y, door.left, AP.h);
    ctx.drawImage(img.right, door.seam + door.right * opened, AP.y, door.right, AP.h);
    ctx.restore();

    /* Trần và mép trong cổng đổi sang trạng thái có ánh sáng. */
    paint(img.frame, ramp(t, T.frame));

    /* Ánh hắt buộc phải nhân với độ mở của cửa: chưa hé thì không có tia nào. */
    paint(img.spill, intensity.spill * ramp(t, T.spill) * opened, "screen");
    paint(img.bounce, intensity.bounce * ramp(t, T.bounce) * opened, "screen");

    /* Dòng sáng trên sông. Giữ nguyên texture gốc, chỉ cho một mép sáng mềm
       chạy từ chân cổng xuống tiền cảnh — không vẽ đè nét neon mới. */
    const flow = ramp(t, T.river);
    const mask = maskRef.current;
    if (flow > 0 && mask) {
      const mx = mask.getContext("2d");
      if (mx) {
        const front = scene.river.from + flow * (scene.river.to - scene.river.from);
        mx.setTransform(s, 0, 0, s, 0, 0);
        mx.globalCompositeOperation = "source-over";
        mx.clearRect(0, 0, C.w, C.h);
        mx.drawImage(img.river, 0, 0, C.w, C.h);
        mx.globalCompositeOperation = "destination-in";
        const edge = mx.createLinearGradient(
          0,
          front - scene.river.feather[0],
          0,
          front + scene.river.feather[1],
        );
        edge.addColorStop(0, "white");
        edge.addColorStop(1, "transparent");
        mx.fillStyle = edge;
        mx.fillRect(0, 0, C.w, C.h);
        mx.globalCompositeOperation = "source-over";
        paint(mask, ramp(t, [T.river[0], T.river[0] + 0.4]), "screen");
      }
    }

    /* Mây: hiện ở chân cổng, nở ra rồi trôi sang hai bên. Lấy chân cổng làm
       tâm phóng để nó bò ra từ khe cửa chứ không phình ra giữa trời. */
    const spread = ramp(t, T.fog);
    if (spread > 0) {
      const { scale: fogScale, drift, rise } = scene.fog;
      ctx.save();
      ctx.translate(scene.threshold.x, scene.threshold.y);
      ctx.scale(
        fogScale.from[0] + (fogScale.to[0] - fogScale.from[0]) * spread,
        fogScale.from[1] + (fogScale.to[1] - fogScale.from[1]) * spread,
      );
      ctx.translate(-scene.threshold.x, -scene.threshold.y);
      const density = intensity.fog * ramp(t, T.fogFade);
      paint(img.fogLeft, density, "source-over", -drift * spread, -rise[0] * spread);
      paint(img.fogRight, density, "source-over", drift * spread, -rise[1] * spread);
      ctx.restore();
    }

    /* Hai bức tranh gốc lệch nhau chút texture. Hoà về end frame SAU khi cửa
       đã mở xong — crossfade giữa chừng sẽ làm núi và mái nhà bóng đôi. */
    paint(img.end, ramp(t, T.settle));
  }, []);

  /* ------------------------------------------------------- TẢI & ĐO ĐẠC */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", { alpha: false });
    maskRef.current = document.createElement("canvas");

    let alive = true;

    /* Backing buffer bám theo cỡ thật trên màn, chặn ở khổ gốc 1080. Màn hình
       nào cũng vẽ đúng một cảnh; chỉ số pixel thật là khác. */
    const resize = () => {
      const mask = maskRef.current;
      if (!alive || !mask) return;
      const box = canvas.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      const cover = window.matchMedia(COVER_QUERY).matches;
      const shown = cover
        ? Math.max(box.width, box.height * RATIO)
        : Math.min(box.width, box.height * RATIO);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const next = Math.min(1, Math.max(0.4, (shown * dpr) / C.w));

      if (canvas.width > 0 && Math.abs(next - scaleRef.current) < 0.05) {
        placeAperture();
        return;
      }

      scaleRef.current = next;
      canvas.width = Math.round(C.w * next);
      canvas.height = Math.round(C.h * next);
      mask.width = canvas.width;
      mask.height = canvas.height;
      placeAperture();
      draw(timeRef.current);
    };

    /* Cú phóng cuối và quầng sáng đều lấy tâm ô cửa làm gốc, mà ô cửa nằm ở
       đâu trên màn thì phụ thuộc contain/cover — nên phải đo, không đoán. */
    const placeAperture = () => {
      const stage = stageRef.current;
      const glow = glowRef.current;
      if (!stage || !glow) return;
      const box = canvas.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      const cover = window.matchMedia(COVER_QUERY).matches;
      const fit = cover
        ? Math.max(box.width / C.w, box.height / C.h)
        : Math.min(box.width / C.w, box.height / C.h);
      const x = (box.width - C.w * fit) / 2 + (AP.x + AP.w / 2) * fit;
      const y = (box.height - C.h * fit) / 2 + (AP.y + AP.h / 2) * fit;

      stage.style.transformOrigin = `${x}px ${y}px`;
      glow.style.setProperty("--beam-x", `${x}px`);
      glow.style.setProperty("--beam-y", `${y}px`);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const entries = Object.entries(scene.layers);
    Promise.all(
      entries.map(
        ([key, file]) =>
          new Promise<[string, HTMLImageElement]>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve([key, image]);
            image.onerror = () => reject(new Error(file));
            image.src = `${scene.dir}/${file}`;
          }),
      ),
    )
      .then((loaded) => {
        if (!alive) return;
        imagesRef.current = Object.fromEntries(loaded);
        resize();
        draw(0);
        handlers.current.onReady();
      })
      // Thiếu một layer là cảnh sai hẳn, nên bỏ hẳn cổng và quay về nền tĩnh.
      .catch(() => {
        if (alive) handlers.current.onFail();
      });

    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [draw]);

  /* --------------------------------------------------------- CHUỖI MỞ CỬA */

  useEffect(() => {
    if (!open) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { t: 0 };

    const reveal = () => handlers.current.onReveal();
    const timeline = gsap.timeline({ onComplete: () => handlers.current.onFinished() });

    // Ai tắt hiệu ứng thì về thẳng trạng thái cửa đã mở, rồi chuyển sang hero.
    if (reduce) {
      draw(scene.duration);
      timeline
        .to(contentRef.current, { opacity: 0, duration: 0.25 }, 0)
        .to(glowRef.current, { opacity: HO.glow * 0.6, duration: 0.3 }, 0.1)
        .call(reveal, undefined, 0.3)
        .set(rootRef.current, { pointerEvents: "none" }, 0.3)
        .to(rootRef.current, { opacity: 0, duration: 0.45 }, 0.3);
      return () => {
        timeline.kill();
      };
    }

    timeline
      /* Chữ và nút nhường chỗ trước, để mắt theo kịp cửa. */
      .to(contentRef.current, { opacity: 0, y: -12, duration: 0.45, ease: "power2.out" }, 0)
      /* Một tween duy nhất kéo cả chuỗi; mọi nhịp riêng nằm trong draw(). */
      .to(
        state,
        {
          t: scene.duration,
          duration: scene.duration,
          ease: "none",
          onUpdate: () => draw(state.t),
        },
        0,
      )
      /* Bước qua cửa: cảnh phóng về phía ô cửa, ánh vàng trong đó trào ra. */
      .to(stageRef.current, { scale: HO.zoom, duration: HO.push, ease: "power2.in" }, HO.start)
      /* Quầng sáng phải lên tới đỉnh ĐÚNG lúc lớp cổng bắt đầu tan, nếu không
         nó sẽ mờ đi cùng lớp cổng và coi như không ai thấy. */
      .to(
        glowRef.current,
        {
          opacity: HO.glow,
          duration: Math.max(0.4, HO.reveal - HO.start - 0.15),
          ease: "power2.in",
        },
        HO.start + 0.15,
      )
      /* Hero hiện lên BÊN DƯỚI trước khi lớp cổng tan — hai ảnh chồng nhau một
         nhịp nên không có cú cắt, và trang mở khoá cuộn từ đây. */
      .call(reveal, undefined, HO.reveal)
      .set(rootRef.current, { pointerEvents: "none" }, HO.reveal)
      .to(rootRef.current, { opacity: 0, duration: HO.fade, ease: "power2.inOut" }, HO.reveal);

    return () => {
      timeline.kill();
    };
  }, [open, draw]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-night">
      <div ref={stageRef} className="absolute inset-0 will-change-transform">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="block size-full object-contain [@media(max-aspect-ratio:9/16)]:object-cover"
        />
        {/* Ánh sáng từ ô cửa trào ra, tâm đặt bằng --beam-x / --beam-y ở trên */}
        <div ref={glowRef} aria-hidden className="beam absolute inset-0 opacity-0" />
      </div>

      <div ref={contentRef} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
