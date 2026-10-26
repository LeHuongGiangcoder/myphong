"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { LANGS, LANG_LABEL, LANG_NAME, pick } from "@/content/i18n";

/**
 * Nút chuyển VI / EN, nổi ở góc trên phải.
 *
 * Hiện ngay từ màn mở thiệp (z cao hơn Intro) để khách nước ngoài đổi được
 * tiếng trước khi đọc bất cứ thứ gì. Màu dùng nhóm màu nền của trang chứ
 * không dùng `tone-*`: nút nằm ngoài mọi section nên không có `data-tone`
 * nào ở trên để kế thừa.
 */
export function LocaleToggle() {
  const { lang, setLang } = useLocale();

  return (
    <div
      className="fixed z-50 flex items-center p-1 rounded-full backdrop-blur-md bg-forest-deep/60 border border-cream/20 shadow-sm"
      style={{
        right: "max(var(--t-space-gutter), env(safe-area-inset-right))",
        top: "calc(var(--t-space-stack) + env(safe-area-inset-top))",
      }}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={pick(LANG_NAME[code], lang)}
            className={`flex items-center justify-center min-w-[2.25rem] px-2.5 py-1 rounded-full font-body text-eyebrow font-medium uppercase transition-all duration-200 ${
              active
                ? "bg-forest text-cream shadow-xs"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            {LANG_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
