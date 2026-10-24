import { ceremony, couple, venue } from "@/content/client";
import { pick, type Lang } from "@/content/i18n";

/** Google Calendar muốn dạng YYYYMMDDTHHMMSSZ (UTC). */
function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const TITLE = {
  vi: (names: string) => `Lễ cưới ${names}`,
  en: (names: string) => `Wedding of ${names}`,
};

/**
 * Link "Thêm vào lịch" — mở sẵn form tạo sự kiện của Google Calendar.
 *
 * Nhận `lang` vì tên sự kiện đi vào lịch của chính khách, nên nó phải cùng
 * thứ tiếng khách đang đọc thiệp.
 */
export function googleCalendarUrl(lang: Lang): string {
  const names = `${couple.groom} & ${couple.bride}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE[lang](names),
    dates: `${stamp(ceremony.startISO)}/${stamp(ceremony.endISO)}`,
    details: `${venue.name} — ${pick(venue.hall, lang)}`,
    location: `${venue.name}, ${venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
