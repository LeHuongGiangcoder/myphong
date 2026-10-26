"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, hero, venue } from "@/content/client";

/**
 * Trang bìa, dựng theo bản thiết kế khách gửi — bố cục kiểu bìa tạp chí:
 * tên hai người to gần hết bề ngang, ảnh tách nền của cặp đôi đứng đè lên chữ
 * (đầu chú rể che một phần tên cô dâu, vai cô dâu che đuôi tên chú rể), rồi
 * chỉ còn hai khối chữ nhỏ ở hai góc dưới.
 *
 * KHÔNG có lớp phủ nào giữa chủ thể và nền: `overlay` của section đặt về 0, và
 * độ tối cần cho chữ ở hai góc dưới đã được nướng sẵn vào chính ảnh nền, nên
 * nó nằm SAU cặp đôi — đọc ra như ánh sáng tắt dần chứ không phải một lớp dán
 * đè lên ảnh.
 *
 * Bố cục là một "tấm poster" dọc đặt giữa màn hình, rộng tối đa 36rem. Ảnh
 * cặp đôi cao theo `min(72svh, 160vw)`: trên điện thoại con số 160vw thắng nên
 * ảnh rộng gần hết màn, trên máy to thì 72svh thắng nên ảnh không bao giờ cao
 * quá một màn hình. Khối tên neo theo % chiều cao của ảnh, nhờ vậy chỗ chồng
 * nhau giữa chữ và người giữ nguyên ở mọi khổ máy.
 *
 * Các khối gắn `data-hero` nên chúng hiện theo cú chạm mở thiệp chứ không chờ
 * cuộn — hero nằm ngay dưới màn mở thiệp nên sẽ không bao giờ "cuộn tới".
 */
export function Hero() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[36rem] flex-col">
        <div className="relative mt-auto">
          <div
            data-reveal
            data-hero
            className="absolute inset-x-0 -top-[9%] flex flex-col gap-tight px-gutter"
          >
            <Eyebrow className="text-tone-fg">{t(hero.eyebrow)}</Eyebrow>
            <Heading level="poster" id="hero-title" className="uppercase short:text-display">
              {/* Dấu & đứng cuối dòng trên: dòng dưới là chỗ đầu chú rể che vào */}
              <span className="block">
                {couple.groom}{" "}
                <span className="text-h1 italic normal-case text-tone-accent">&amp;</span>
              </span>
              <span className="block">{couple.bride}</span>
            </Heading>
          </div>

          <Image
            data-reveal
            data-hero
            src={hero.portrait.src}
            alt={t(hero.portrait.alt)}
            width={1400}
            height={2244}
            priority
            sizes="(min-width: 64rem) 45vh, 100vw"
            className="relative z-10 mx-auto block h-[min(72svh,160vw)] w-auto max-w-full"
          />

          {/* mb-tap: chừa chỗ cho nút nhạc cố định ở góc dưới phải */}
          <div
            data-reveal
            data-hero
            className="absolute inset-x-0 bottom-0 z-20 mb-tap flex flex-col gap-stack px-gutter pb-section sm:flex-row sm:items-end sm:justify-between sm:gap-block"
          >
            <p className="max-w-prose text-small text-tone-fg">{t(hero.invitation)}</p>

            <div className="flex flex-col items-end gap-tight self-end text-right sm:shrink-0">
              <Divider className="max-w-[3.5rem]" />
              <p className="font-body text-eyebrow font-medium uppercase text-tone-fg">
                {ceremony.dateShort}
              </p>
              <p className="font-body text-eyebrow font-medium uppercase text-tone-fg">
                {venue.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
