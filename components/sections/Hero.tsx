"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Heading } from "@/components/ui/Heading";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { couple, hero } from "@/content/client";

/**
 * Trang bìa, dựng theo bản thiết kế khách gửi (public/hero) — một tấm poster
 * dọc: ảnh cặp đôi ăn hết khung, tên thiệp chữ nghiêng lớn ở đỉnh, chân trang
 * là tên hai người.
 *
 * Ảnh KHÔNG bị phủ tối toàn bộ (`overlay: 0` trong `design.hero`). Thay vào
 * đó chỉ hai dải `scrim-top` / `scrim-bottom` ở hai mép đỡ chữ, nên khoảng
 * giữa — mái ngói, bức tường vàng, mặt hồ sen — vẫn là ảnh nguyên vẹn.
 *
 * Tên hai người căn ĐỀU theo dấu "&": một hàng flex căn giữa với `gap-tight`
 * bằng nhau hai bên, chứ không phải lưới hai cột 1fr — lưới 1fr đặt mỗi tên vào
 * giữa nửa của nó nên hai tên dài ngắn khác nhau làm khoảng hở hai bên "&" lệch.
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

        {/* mb-stack cộng với pb-tap của khối cha chừa chỗ cho nút nhạc ở góc
            dưới phải. */}
        <div
          data-reveal
          data-hero
          data-reveal-delay="120"
          className="mb-stack flex flex-col items-center gap-stack"
        >
          <div className="flex items-end justify-center gap-tight whitespace-nowrap">
            <Name role={t(hero.roles.groom)} name={t(couple.groomFull)} />
            <span className="font-display italic text-base sm:text-h4 leading-none text-tone-fg">&amp;</span>
            <Name role={t(hero.roles.bride)} name={t(couple.brideFull)} />
          </div>
        </div>
      </div>

      <ScrollHint label={t(hero.scrollHint)} />
    </SectionWrapper>
  );
}

/** Nhãn nhỏ in hoa + tên đầy đủ của một người, một cột căn giữa. */
function Name({ role, name }: { role: string; name: string }) {
  return (
    <span className="flex flex-col items-center gap-tight">
      <span className="head-eyebrow text-tone-fg">{role}</span>
      <span className="font-display text-base sm:text-h4 font-medium uppercase leading-none text-tone-fg">
        {name}
      </span>
    </span>
  );
}
