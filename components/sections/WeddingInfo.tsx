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
 * Time & Venue — chỉ hai điều: khi nào, và ở đâu.
 *
 * Section này gồm hai tầng:
 *
 *   1. Bức tranh mực của khách, dùng NGUYÊN BẢN (một ảnh, không tách mảnh),
 *      giữ đúng khổ 9:16. Tên section và ngày cưới nằm trong khoảng giấy
 *      trống của chính bức tranh.
 *   2. Giấy trơn phía dưới: địa điểm, lời nhắn, hai nút.
 *
 * Phải tách hai tầng vì khoảng trống của bức tranh chỉ cao bằng một nửa bức
 * tranh (12%–62%). Ở khổ điện thoại, nửa đó là ~330px — đủ cho tiêu đề và
 * ngày, không đủ cho cả section. Nhồi hết vào là chữ nằm đè lên mái đình và
 * dải mực xanh, tương phản tụt xuống 1:1.
 *
 * Cũng vì vậy section cố ý KHÔNG có danh sách gia đình hay ảnh cặp đôi.
 */
export function WeddingInfo() {
  const { lang, t } = useLocale();

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title" flush width="bleed">
      {/*
        Khung tranh: luôn đúng khổ 9:16 của bức tranh, nên khoảng giấy trống
        của nó rơi vào cùng một tỉ lệ ở mọi khổ máy. Bức tranh chính là hoạ
        tiết `timevenue` do SectionWrapper đặt vào (xem `design` trong
        content/client.ts); khối này chỉ giữ chỗ và neo chữ lên trên nó.

        Khối chữ LỆCH TRÁI, không căn giữa: khoảng trống của bức tranh nằm
        lệch về trái, còn mép phải có dải mực chạy dọc xuống quá nửa chiều
        cao. Căn giữa thì dòng dài nhất (ngày âm lịch) đâm vào dải mực đó và
        tương phản tụt còn 2:1. Giới hạn 2%–64% bề ngang là ranh của vùng
        trống ở đoạn hẹp nhất (khoảng 52%–65% chiều cao tranh).
      */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-stage">
        <div className="absolute left-[2%] top-[19%] flex w-[62%] max-w-prose flex-col items-center gap-stack text-center">
          <SectionHead
            eyebrow={t(weddingInfo.eyebrow)}
            title={t(weddingInfo.title)}
            titleId="wedding-info-title"
          />

          <Reveal className="flex flex-col items-center gap-tight">
            <Eyebrow>{t(weddingInfo.saveTheDateLabel)}</Eyebrow>
            <Heading level="h2">{ceremony.dateShort}</Heading>
            <Caption>
              {t(ceremony.weekday)} · {ceremony.timeLabel}
            </Caption>
            <Caption>{t(ceremony.lunar)}</Caption>
          </Reveal>
        </div>
      </div>

      {/* Dưới bức tranh là giấy trơn — chỗ cho phần chi tiết còn lại */}
      <Reveal className="container-prose flex flex-col items-center gap-stack pb-section text-center">
        <Divider diamond />

        <div className="flex flex-col items-center gap-tight">
          <Eyebrow>{t(weddingInfo.venueLabel)}</Eyebrow>
          <Heading level="h3">{venue.name}</Heading>
          <p className="font-display text-h4">{t(venue.hall)}</p>
          <Caption>{venue.address}</Caption>
        </div>

        <Script>{t(venue.note)}</Script>

        <div className="flex w-full flex-col items-center gap-stack sm:flex-row sm:justify-center">
          <ButtonLink href={venue.mapUrl} target="_blank" rel="noreferrer noopener">
            {t(venue.mapLabel)}
          </ButtonLink>
          <ButtonLink href={googleCalendarUrl(lang)} target="_blank" rel="noreferrer noopener">
            {t(weddingInfo.calendarLabel)}
          </ButtonLink>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
