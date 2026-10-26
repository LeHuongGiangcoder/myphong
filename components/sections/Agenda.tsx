"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { agenda } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Trình tự buổi lễ: các mốc giờ là chính, dải sen đứng làm nền bên cạnh.
 *
 * Trước đây bốn mốc giờ rải vào các ô trống dọc dải sen. Cách đó bắt chữ
 * phải nhỏ và ngắn cho vừa ô — giờ đổi lại: dải sen thu còn 44% bề ngang và
 * lùi sang mép phải, còn các mốc giờ xếp thành một cột bên trái, giờ in cỡ
 * h3 màu nhấn nên đọc lướt là thấy ngay.
 *
 * Dải sen đặt thẳng trong component (không qua `decor` của SectionWrapper)
 * vì nó phải bám mép phải của KHUNG rộng tối đa 32rem, chứ không phải mép
 * phải của màn hình.
 */
export function Agenda() {
  const { t } = useLocale();
  const art = element("agenda");

  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title" flush width="bleed">
      <div className="relative mx-auto w-full max-w-stage py-section">
        {art ? (
          <Image
            aria-hidden
            alt=""
            src={art.src}
            width={art.width ?? 1080}
            height={art.height ?? 1920}
            sizes="(max-width: 32rem) 44vw, 14rem"
            className="pointer-events-none absolute right-0 top-1/2 -z-10 w-[44%] -translate-y-1/2"
          />
        ) : null}

        <div className="flex w-[56%] flex-col px-gutter">
          <SectionHead
            eyebrow={t(agenda.eyebrow)}
            title={t(agenda.title)}
            titleId="agenda-title"
            align="left"
          />

          <ol className="flex flex-col gap-block">
            {agenda.items.map((item, i) => (
              <Reveal as="li" key={`${item.time}-${i}`} delay={i * 80} className="flex flex-col">
                <p className="font-display text-h3 text-tone-accent">{item.time}</p>
                <Heading level="h4">{t(item.title)}</Heading>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
