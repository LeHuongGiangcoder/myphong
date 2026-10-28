import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "icon";

const BASE =
  "inline-flex items-center justify-center gap-tight font-body text-eyebrow font-semibold uppercase transition-[transform,background-color,color] duration-200 ease-glow disabled:opacity-55 disabled:pointer-events-none";

/*
  Vùng chạm luôn >= 2.75rem (min-h-tap) để ngón tay bấm không trượt.

  Bề rộng: nút KHÔNG kéo hết bề ngang màn nữa. `w-auto` + `min-w-[11rem]` cho
  ra một viên thuốc dài vừa phải trên điện thoại, `max-w-full` chặn lại khi
  nhãn quá dài. Nút căng hết màn trông như thanh công cụ của ứng dụng, không
  phải như một tấm thiệp.

  Mặt nút là hình chữ nhật phẳng (`.btn-solid` / `.btn-ghost` trong
  globals.css) — màu lấy từ tông của section nên không phải khai báo lại ở đây.
  KHÔNG thêm `rounded-*` ở đây: hai class đó đã đặt góc vuông.

  KHÔNG có bóng đổ quanh nút: nút đặc phẳng đặt thẳng lên giấy, như một con
  dấu, không phải một vật nổi.
*/
const VARIANT: Record<Variant, string> = {
  primary:
    "min-h-tap w-auto min-w-[11rem] max-w-full px-block py-stack btn-solid text-tone-bg hover:[@media(hover:hover)]:-translate-y-px",
  outline:
    "min-h-tap w-auto min-w-[11rem] max-w-full px-block py-stack btn-ghost text-tone-fg hover:[@media(hover:hover)]:-translate-y-px",
  icon: "size-tap min-w-tap btn-ghost text-tone-fg",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

/** Nút bấm. Màu lấy từ tông của section đang bọc nó. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Cùng hình dáng với Button nhưng là thẻ <a> — dùng cho link Maps, lịch. */
export function ButtonLink({
  variant = "outline",
  className = "",
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
