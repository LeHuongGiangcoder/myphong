"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  DEFAULT_LANG,
  isLang,
  langFromNavigator,
  pick,
  type L,
  type Lang,
  type Translate,
} from "@/content/i18n";

const STORAGE_KEY = "glow-lang";

type LocaleValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Lấy chữ đúng thứ tiếng đang chọn ra khỏi một cặp `{ vi, en }`. */
  t: Translate;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale phải nằm trong <LocaleProvider>");
  return value;
}

/** Tab khác đổi tiếng thì tab này đổi theo. */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Tiếng đoán cho khách: lựa chọn đã lưu, chưa có thì theo ngôn ngữ trình duyệt.
 * Safari ở chế độ riêng tư ném lỗi khi đọc localStorage.
 */
function readPreferred(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* không đọc được thì đoán theo trình duyệt */
  }
  return langFromNavigator();
}

/** Trên server chưa biết gì về khách — HTML dựng sẵn luôn là tiếng Việt. */
const readDefault = (): Lang => DEFAULT_LANG;

/**
 * Giữ thứ tiếng đang xem.
 *
 * HTML dựng trên server luôn là `DEFAULT_LANG`; React đọc lựa chọn thật của
 * khách qua `useSyncExternalStore` khi hydrate, nên không có nhịp nào server
 * và client nói hai thứ khác nhau. Khách tự bấm VI / EN thì `chosen` đè lên
 * cái đoán được.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const preferred = useSyncExternalStore(subscribe, readPreferred, readDefault);
  const [chosen, setChosen] = useState<Lang | null>(null);
  const lang = chosen ?? preferred;

  // Trình đọc màn hình và công cụ dịch đọc thuộc tính này để phát âm đúng.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setChosen(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* không lưu được thì thôi, lựa chọn vẫn có tác dụng trong phiên này */
    }
  }, []);

  const value = useMemo<LocaleValue>(
    () => ({ lang, setLang, t: (text: L) => pick(text, lang) }),
    [lang, setLang],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
