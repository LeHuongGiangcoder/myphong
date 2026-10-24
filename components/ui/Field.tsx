import type { ReactNode } from "react";

/** Nhãn của một ô nhập — in hoa, nhỏ, cùng cỡ với eyebrow. */
export function FieldLabel({
  htmlFor,
  as: Tag = "label",
  children,
}: {
  htmlFor?: string;
  as?: "label" | "legend";
  children: ReactNode;
}) {
  const className = "font-body text-eyebrow font-medium uppercase text-tone-muted";
  return Tag === "legend" ? (
    <legend className={className}>{children}</legend>
  ) : (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

/** Một ô nhập: nhãn trên, ô dưới. */
export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-tight">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
    </div>
  );
}

/** Một lựa chọn radio — cả dòng là vùng chạm, cao tối thiểu 2.75rem. */
export function Choice({
  name,
  value,
  checked,
  onChange,
  /**
   * Bắt buộc phải chọn một trong nhóm. Đặt trên MỌI lựa chọn cùng `name`:
   * trình duyệt coi cả nhóm là bắt buộc và tự nhắc ở lựa chọn đầu tiên.
   */
  required = false,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-tap cursor-pointer items-center gap-stack text-small">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        className="size-4 shrink-0 accent-tone-accent"
      />
      <span>{children}</span>
    </label>
  );
}

/**
 * Chọn một con số bằng hai nút − / +.
 *
 * Dùng thay cho một dãy radio khi lựa chọn chỉ là "mấy cái": dãy radio dài
 * sáu dòng đẩy mọi thứ dưới nó ra khỏi màn hình điện thoại, còn cái này cao
 * đúng một hàng. Hai nút là vùng chạm đủ lớn (`size-tap`), con số ở giữa
 * được `aria-live` đọc lại mỗi lần đổi.
 */
export function Stepper({
  value,
  onChange,
  min = 1,
  max,
  decreaseLabel,
  increaseLabel,
  children,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  /** Con số đã viết thành chữ, ví dụ "2 người". */
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-stack">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={decreaseLabel}
        className="flex size-tap shrink-0 items-center justify-center rounded-btn border border-tone-line text-tone-fg disabled:opacity-35"
      >
        <span aria-hidden>−</span>
      </button>

      <p aria-live="polite" className="min-w-[6.5rem] text-center font-display text-h4">
        {children}
      </p>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={increaseLabel}
        className="flex size-tap shrink-0 items-center justify-center rounded-btn border border-tone-line text-tone-fg disabled:opacity-35"
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
