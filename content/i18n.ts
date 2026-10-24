/**
 * Song ngữ Việt — Anh.
 *
 * Mọi câu chữ của khách trong `content/client.ts` là một cặp `{ vi, en }`
 * thay vì một chuỗi. Khách bấm nút VI / EN ở góc trên phải, `LocaleProvider`
 * đổi `lang`, và mọi section đọc lại chữ qua `t()`.
 *
 * Chỉ chữ mới song ngữ. Những thứ không dịch — tên người, số điện thoại,
 * ngày dạng `20 . 12 . 2026`, giờ `17:30`, mã màu, hashtag, tên bài hát —
 * vẫn là chuỗi thường.
 */

export type Lang = "vi" | "en";

/** Một câu, hai thứ tiếng. */
export type L = { vi: string; en: string };

export const LANGS: Lang[] = ["vi", "en"];

/** Tiếng mặc định khi chưa biết gì về khách. */
export const DEFAULT_LANG: Lang = "vi";

/** Nhãn của chính nút chuyển — không đi qua `t()` vì nó hiện cả hai cùng lúc. */
export const LANG_LABEL: Record<Lang, string> = { vi: "VI", en: "EN" };

/** Tên ngôn ngữ đầy đủ, cho `aria-label` của nút chuyển. */
export const LANG_NAME: Record<Lang, L> = {
  vi: { vi: "Tiếng Việt", en: "Vietnamese" },
  en: { vi: "Tiếng Anh", en: "English" },
};

export type Translate = (value: L) => string;

/** Lấy một thứ tiếng ra khỏi cặp. Thiếu bản dịch thì rơi về tiếng Việt. */
export function pick(value: L, lang: Lang): string {
  return value[lang] || value.vi;
}

/** `vi` nếu trình duyệt của khách là tiếng Việt, còn lại `en`. */
export function langFromNavigator(): Lang {
  const tags = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  return tags.some((tag) => tag?.toLowerCase().startsWith("vi")) ? "vi" : "en";
}

export function isLang(value: unknown): value is Lang {
  return value === "vi" || value === "en";
}
