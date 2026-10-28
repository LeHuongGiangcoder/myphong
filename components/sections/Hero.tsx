"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, hero, venue } from "@/content/client";

/**
 * Trang bìa, dựng theo bản thiết kế khách gửi (public/hero) — một tấm poster
 * dọc: ảnh cặp đôi ăn hết khung, tên thiệp chữ nghiêng lớn ở đỉnh, chân trang
 * là tên hai người, ngày và nơi tổ chức.
 *
 * Ảnh KHÔNG bị phủ tối toàn bộ (`overlay: 0` trong `design.hero`). Thay vào
 * đó chỉ hai dải `scrim-top` / `scrim-bottom` ở hai mép đỡ chữ, nên khoảng
 * giữa — mái ngói, bức tường vàng, mặt hồ sen — vẫn là ảnh nguyên vẹn.
 *
 * Tên hai người căn ĐỀU theo dấu "&": một hàng flex căn giữa với `gap-stack`
 * bằng nhau hai bên, chứ không phải lưới hai cột 1fr. Lưới 1fr đặt mỗi tên
 * vào giữa nửa của nó, mà hai tên dài ngắn khác nhau nên khoảng hở hai bên
 * dấu "&" lệch hẳn — tên dài gần như chạm vào dấu, tên ngắn thì hở một
 * quãng. Hàng flex giữ dấu "&" cách đều cả hai tên.
 *
 * Các khối gắn `data-hero` nên chúng hiện theo cú chạm mở thiệp chứ không chờ
 * cuộn — hero nằm ngay dưới màn mở thiệp nên sẽ không bao giờ "cuộn tới".
 */
export function Hero() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <span aria-hidden className="scrim-top absolute inset-x-0 top-0 h-[42%]" />
      <span aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-[32%]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-container-stage flex-col items-center justify-between px-gutter pb-tap pt-section text-center short:pb-stack short:pt-stack">
        <div data-reveal data-hero className="flex flex-col items-center gap-tight">
          <p className="head-eyebrow text-tone-fg">
            {t(hero.eyebrow)}
          </p>
          <Heading
            level="poster"
            id="hero-title"
            className="whitespace-pre-line italic text-tone-fg short:text-h1"
          >
            {t(hero.title)}
          </Heading>
          <p className="mt-tight text-balance font-body text-small text-tone-fg">
            {t(hero.invitation)}
          </p>
        </div>

        {/* mb-stack cộng với pb-tap của khối cha = đúng mép trên của nút nhạc
            cố định ở góc dưới phải, nên dòng "Chủ Nhật · Fairmont Hanoi" không
            bao giờ chạy xuống dưới nút. */}
        <div
          data-reveal
          data-hero
          data-reveal-delay="120"
          className="mb-stack flex flex-col items-center gap-stack"
        >
          <div className="flex items-end justify-center gap-tight whitespace-nowrap">
            <Name role={t(hero.roles.groom)} name={couple.groomFull} />
            <span className="font-display italic text-base sm:text-h4 leading-none text-tone-fg">&amp;</span>
            <Name role={t(hero.roles.bride)} name={couple.brideFull} />
          </div>

          <div className="flex flex-col items-center gap-tight">
            <p className="font-display text-h4 leading-none tracking-widest lining-nums text-tone-fg">
              {ceremony.dateShort}
            </p>
            <p className="font-body text-eyebrow font-medium uppercase text-tone-fg">
              {t(ceremony.weekday)} · {venue.name}
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

/** Nhãn nhỏ in hoa + tên đầy đủ của một người, một cột căn giữa. */
function Name({ role, name }: { role: string; name: string }) {
  return (
    <span className="flex flex-col items-center gap-tight">
      <span className="font-body text-eyebrow font-medium uppercase text-tone-fg">{role}</span>
      <span className="font-display text-base sm:text-h4 font-medium uppercase leading-none text-tone-fg">
        {name}
      </span>
    </span>
  );
}
