import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Một con bướm đậu-bay tại chỗ: cánh khép mở, thân lượn nhẹ quanh vị trí đặt.
 * Dùng chung ảnh cắt ba lớp và `.butterfly` của cổng Bình phong (xem
 * globals.css), nên không cần JS.
 *
 * Đặt nó trong khung `relative` và định vị bằng `className` (`absolute …`,
 * bề ngang `w-[…]`); chiều cao tự theo tỉ lệ 3 : 2 của ảnh.
 * `prefers-reduced-motion` thì đứng yên, cánh mở hé.
 */
export function Butterfly({
  variant = "olive",
  className = "",
  flap = 0.7,
}: {
  variant?: "ivory" | "olive";
  className?: string;
  /** Giây cho một nhịp cánh. */
  flap?: number;
}) {
  return (
    <div aria-hidden className={`pointer-events-none aspect-[3/2] ${className}`}>
      <div className="butterfly-drift size-full">
        <div
          className="butterfly size-full"
          data-flying
          style={{ "--flap": `${flap}s` } as CSSProperties}
        >
          {(["butterfly-wing-left", "butterfly-wing-right", "butterfly-body"] as const).map((part) => (
            <Image
              key={part}
              src={`/images/intro/butterfly-${variant}.webp`}
              alt=""
              width={360}
              height={240}
              unoptimized
              draggable={false}
              className={part}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
