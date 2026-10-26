"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { agenda } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Trình tự buổi lễ: dải sen chảy giữa trang, bốn mốc giờ đậu hai bên bờ.
 *
 * Dải sen trải trọn bề ngang khung (trước đây chỉ 44% và nép mép phải) nên
 * đọc ra một dòng sông chứ không phải một vệt trang trí. Dòng sông uốn chữ
 * S, chừa sẵn bốn ô giấy trống so le — quét mực theo lưới 24×10 cho thấy:
 *
 *   trái  y 13–22%   phải y 29–38%   trái y 46–57%   phải y 66–78%
 *
 * MARKS bên dưới bám đúng bốn ô đó. Đổi ảnh dải sen hay thêm mốc thứ năm
 * thì phải quét lại và sửa mảng này, không đoán.
 */
const MARKS = [
  { at: "left-0 top-[13%]", align: "text-left" },
  { at: "right-0 top-[29%]", align: "text-right" },
  { at: "left-0 top-[46%]", align: "text-left" },
  { at: "right-0 top-[66%]", align: "text-right" },
] as const;

export function Agenda() {
  const { t } = useLocale();
  const art = element("agenda");

  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title" flush width="bleed">
      <div className="mx-auto flex w-full max-w-stage flex-col pt-section">
        <div className="px-gutter">
          <SectionHead
            eyebrow={t(agenda.eyebrow)}
            title={t(agenda.title)}
            titleId="agenda-title"
            align="left"
            flush
          />
        </div>

        <div className="relative aspect-[1080/1920] w-full">
          {art ? (
            <Image
              aria-hidden
              alt=""
              src={art.src}
              width={art.width ?? 1080}
              height={art.height ?? 1920}
              sizes="(max-width: 32rem) 100vw, 32rem"
              className="seam-soft pointer-events-none absolute inset-0 -z-10 w-full"
            />
          ) : null}

          <ol>
            {agenda.items.map((item, i) => {
              const mark = MARKS[i % MARKS.length];
              return (
                <Reveal
                  as="li"
                  key={`${item.time}-${i}`}
                  delay={i * 80}
                  className={`absolute flex w-[46%] flex-col px-gutter ${mark.at} ${mark.align}`}
                >
                  <p className="font-display text-h3 text-tone-accent">{item.time}</p>
                  <Heading level="h4">{t(item.title)}</Heading>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
