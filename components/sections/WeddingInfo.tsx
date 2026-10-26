"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, Script, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, venue, weddingInfo } from "@/content/client";
import { googleCalendarUrl } from "@/lib/calendar";

/**
 * Time & Venue — khi nào, và ở đâu.
 *
 * MỘT cột chữ duy nhất, nằm trong khoảng giấy trống bên TRÁI bức tranh. Đo
 * tương phản cho thấy cột trái sạch hoàn toàn (0% vướng mực) từ đỉnh xuống
 * tới 70% chiều cao tranh, rộng tới 64% bề ngang; dưới mốc đó là mái đình và
 * dải mực xanh nên chữ phải dừng lại.
 *
 * Vì vậy bức tranh để rộng hơn khung một chút và neo bên trái: phần ribbon
 * chạy dọc mép phải bị cắt bớt, đổi lại cột chữ có đủ chiều cao mà mái đình
 * vẫn nguyên vẹn. Không tách khối nào xuống dưới tranh nữa.
 */
export function WeddingInfo() {
  const { lang, t } = useLocale();

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title" flush width="bleed">
      {/* Khung cao hơn khổ tranh vì tranh được phóng to 150% và neo trái —
          xem ghi chú ở đầu file. 9/22.4 = 1 / (1.5 × 16/9). */}
      <div className="relative mx-auto w-full max-w-stage" style={{ aspectRatio: "9 / 24" }}>
        <Reveal className="absolute inset-y-0 left-0 flex w-[84%] flex-col justify-start gap-stack px-gutter pt-section text-left">
          <SectionHead
            eyebrow={t(weddingInfo.eyebrow)}
            title={t(weddingInfo.title)}
            titleId="wedding-info-title"
            align="left"
            flush
          />

          <Divider className="max-w-[3.5rem]" />

          <div className="flex flex-col gap-tight">
            <Eyebrow>{t(weddingInfo.saveTheDateLabel)}</Eyebrow>
            <Heading level="h3">{ceremony.dateShort}</Heading>
            <Caption>
              {t(ceremony.weekday)} · {ceremony.timeLabel}
            </Caption>
            <Caption>{t(ceremony.lunar)}</Caption>
          </div>

          <div className="flex flex-col gap-tight">
            <Eyebrow>{t(weddingInfo.venueLabel)}</Eyebrow>
            <Heading level="h3">{venue.name}</Heading>
            <p className="font-display text-h4">{t(venue.hall)}</p>
            <Caption>{venue.address}</Caption>
          </div>

          <Script>{t(venue.note)}</Script>

          <div className="flex flex-col items-start gap-stack">
            <ButtonLink href={venue.mapUrl} target="_blank" rel="noreferrer noopener">
              {t(venue.mapLabel)}
            </ButtonLink>
            <ButtonLink href={googleCalendarUrl(lang)} target="_blank" rel="noreferrer noopener">
              {t(weddingInfo.calendarLabel)}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
