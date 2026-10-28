import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { Reveal } from "./Reveal";

type Level = "poster" | "display" | "h1" | "h2" | "h3" | "h4";

const LEVEL_CLASS: Record<Level, string> = {
  /** Chỉ dùng cho tên hai người ở trang bìa */
  poster: "font-display text-poster",
  display: "font-display text-display",
  h1: "font-display text-h1",
  h2: "head-title",
  h3: "font-display text-h3",
  h4: "font-display text-h4",
};

const LEVEL_TAG: Record<Level, ElementType> = {
  poster: "h1",
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

/*
  Mọi component chữ đều nhận thêm attribute thường (data-reveal, data-hero,
  aria-*) và chuyển xuống thẻ thật, nên section không phải bọc thêm một lớp
  <div> chỉ để gắn attribute cho GSAP.
*/
type TextProps = HTMLAttributes<HTMLElement> & { className?: string; children: ReactNode };

/** Tiêu đề. Cỡ chữ chỉ được lấy từ thang trong content/theme.ts. */
export function Heading({
  level = "h2",
  as,
  className = "",
  children,
  ...rest
}: TextProps & { level?: Level; as?: ElementType }) {
  const Tag = as ?? LEVEL_TAG[level];
  return (
    <Tag className={`${LEVEL_CLASS[level]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Dòng chữ nhỏ in hoa đứng trên tiêu đề. */
export function Eyebrow({
  as: Tag = "p",
  className = "",
  children,
  ...rest
}: TextProps & { as?: ElementType }) {
  return (
    <Tag
      className={`head-eyebrow text-tone-accent ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Câu dẫn dưới tiêu đề. */
export function Lead({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`text-lead text-tone-muted ${className}`} {...rest}>
      {children}
    </p>
  );
}

/** Chú thích nhỏ: giờ, địa chỉ, ghi chú. */
export function Caption({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`text-small text-tone-muted ${className}`} {...rest}>
      {children}
    </p>
  );
}

/** Chữ viết tay — dành cho lời ký và một hai câu nhấn. */
export function Script({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`font-script text-h3 text-tone-accent ${className}`} {...rest}>
      {children}
    </p>
  );
}

/**
 * Đầu section: eyebrow + tiêu đề + câu dẫn, căn giữa, cách khối dưới một
 * `block`. Mọi section dùng chung khối này nên khoảng cách luôn khớp nhau.
 */
/**
 * Đầu mục của một section: dòng nhỏ in hoa, tiêu đề h2, câu dẫn.
 *
 * MỌI section phải dùng component này — đó là chỗ duy nhất quyết định nhịp
 * giữa ba dòng đó, nên đổi ở đây là cả site đổi theo. Chỉ có hai kiểu căn:
 * `center` cho section nằm trong khung tranh, `left` cho section có cột chữ
 * bám mép trái bức tranh.
 *
 * `flush` bỏ khoảng cách dưới, cho khối nào tự quản nhịp bằng gap của nó.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  intro,
  align = "center",
  flush = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  intro?: string;
  align?: "center" | "left";
  flush?: boolean;
  children?: ReactNode;
}) {
  const left = align === "left";
  return (
    <Reveal
      className={[
        "flex flex-col gap-tight",
        flush ? "" : "mb-block",
        left ? "items-start text-left" : "items-center text-center",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading level="h2" id={titleId}>
        {title}
      </Heading>
      {intro ? <Lead className="max-w-prose">{intro}</Lead> : null}
      {children}
    </Reveal>
  );
}
