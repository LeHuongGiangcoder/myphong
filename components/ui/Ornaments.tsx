import Image from "next/image";

import type { ElementName } from "@/content/assets";
import { element } from "@/lib/assets";

export type OrnamentPlacement = {
  name: ElementName;
  /** Utility Tailwind định vị, tính theo KHUNG chứa (ví dụ `"left-[3%] top-[34%]"`). */
  at: string;
  /** Bề ngang, % của khung chứa. Chiều cao theo tỉ lệ ảnh. */
  w: string;
  /** Lật ngang — để cùng một sprite trông như hai chiếc khác nhau. */
  flip?: boolean;
};

/**
 * Một lớp hoạ tiết nhỏ (sparkle, hoa đỏ, mây nhỏ) rải trong một khung. Đặt nó
 * làm CON ĐẦU TIÊN của khung `relative`: nó phủ kín khung, không bắt chuột, và
 * nội dung đứng sau nó trong DOM sẽ nằm trên.
 *
 * Sprite nền trong suốt, nằm ở brand/elements/ (xem scripts/recolor-paper.mjs),
 * đã là WebP không nén mất dữ liệu và rất nhỏ nên phục vụ thẳng (`unoptimized`):
 * nét vàng mảnh mà qua AVIF/WebP có nén sẽ nhoè và mất.
 * Giữ `opacity` 1 — xem "Ba luật thiết kế" trong CLAUDE.md.
 */
export function Ornaments({ items }: { items: readonly OrnamentPlacement[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((o, i) => {
        const art = element(o.name);
        if (!art) return null;
        return (
          <Image
            key={`${o.name}-${i}`}
            src={art.src}
            alt=""
            width={art.width ?? 100}
            height={art.height ?? 100}
            unoptimized
            className={`absolute h-auto select-none ${o.flip ? "-scale-x-100" : ""} ${o.at}`}
            style={{ width: o.w }}
          />
        );
      })}
    </div>
  );
}
