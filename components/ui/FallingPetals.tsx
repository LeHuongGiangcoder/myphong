import Image from "next/image";

import type { ElementName } from "@/content/assets";
import { element } from "@/lib/assets";

type Petal = {
  name: ElementName;
  /** Chỗ cánh hoa bắt đầu rơi, px trong tranh gốc 1080 × 799 của lát dưới thiệp. */
  x: number;
  y: number;
  /** Bề ngang px trong tranh gốc. */
  w: number;
  flip?: boolean;
  /** Giây. Trễ âm để lúc vào trang các cánh đã rơi lệch nhau. */
  delay: number;
  duration: number;
  /** Trôi ngang (px) và xoay (độ) theo cả quãng rơi. */
  drift: number;
  spin: number;
};

/** Ba cánh đầu nằm đúng chỗ cũ trong tranh (scripts/recolor-paper.mjs đã gỡ chúng khỏi ảnh); bốn cánh sau tách ra từ chính bông hoa. */
const PETALS: readonly Petal[] = [
  { name: "petal-a", x: 80, y: 40, w: 66, delay: 0, duration: 15, drift: 90, spin: 240 },
  { name: "petal-b", x: 36, y: 372, w: 60, delay: -4, duration: 12, drift: -50, spin: -200 },
  { name: "petal-c", x: 390, y: 470, w: 66, delay: -7, duration: 13, drift: 110, spin: 180 },
  { name: "petal-a", x: 150, y: 440, w: 52, flip: true, delay: -2, duration: 17, drift: -80, spin: -260 },
  { name: "petal-b", x: 120, y: 300, w: 46, flip: true, delay: -9, duration: 14, drift: 70, spin: 220 },
  { name: "petal-c", x: 240, y: 500, w: 48, delay: -5, duration: 16, drift: -100, spin: 160 },
  { name: "petal-a", x: 300, y: 520, w: 44, delay: -11, duration: 13, drift: 60, spin: -180 },
];

/**
 * Cánh hoa rơi từ bông hoa ở chân thiệp RSVP, trôi xuống tận section Thank you.
 *
 * Đặt nó trong khung có tỉ lệ đúng của lát dưới thiệp (`aspect-[1080/799]`, bám
 * đáy) để toạ độ % khớp tranh. Khung KHÔNG cắt (`overflow` mặc định) nên cánh
 * hoa rơi ra ngoài đáy section; section chứa nó phải có `z-10` thì mới nằm
 * trên section kế tiếp. Chuyển động nằm ở `.petal-fall` trong globals.css; bật
 * "Giảm chuyển động" thì cánh hoa đứng nguyên chỗ cũ trong tranh.
 */
export function FallingPetals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {PETALS.map((p, i) => {
        const art = element(p.name);
        if (!art) return null;
        return (
          <span
            key={i}
            className="petal-fall absolute"
            style={
              {
                left: `${(p.x / 1080) * 100}%`,
                top: `${(p.y / 799) * 100}%`,
                width: `${(p.w / 1080) * 100}%`,
                "--petal-drift": `${p.drift}px`,
                "--petal-spin": `${p.spin}deg`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              } as React.CSSProperties
            }
          >
            <Image
              src={art.src}
              alt=""
              width={art.width ?? 60}
              height={art.height ?? 60}
              unoptimized
              className={`h-auto w-full select-none ${p.flip ? "-scale-x-100" : ""}`}
            />
          </span>
        );
      })}
    </div>
  );
}
