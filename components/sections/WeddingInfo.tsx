"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, venue, weddingInfo } from "@/content/client";

/**
 * Time & Venue — khi nào, và ở đâu.
 *
 * MỘT cột chữ duy nhất, bám mép trái. Bức tranh giữ ĐÚNG khổ gốc 9:16, không
 * phóng và không cắt — dải lụa hồng trên, dải xanh và mái đình dưới đều phải
 * còn nguyên hình. Chỗ ngồi của chữ không lấy bằng cách phóng tranh mà bằng
 * cách để KHUNG cao hơn tranh rồi neo tranh xuống đáy: phần giấy thừa ở trên
 * nối liền với khoảng trống sẵn có trong tranh, thành một cột giấy sạch chạy
 * từ đỉnh section xuống tới ngang ngọn cây.
 *
 * Ba khối thông tin dùng CHUNG một nhịp bốn bậc, nhờ đó mắt đọc được thứ tự:
 *
 *   nhãn nhỏ in hoa (eyebrow)  →  cái tên (h3)  →  dòng phụ (lead)  →  chữ
 *   nhỏ nhạt (caption)
 */
export function WeddingInfo() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title" flush width="bleed">
      {/*
        Hai con số dưới đây đi cùng nhau, đổi một cái là phải đo lại cái kia.

        `9/32` là chiều cao khung. `top-[19%]` là chỗ dòng đầu tiên bắt đầu —
        253px ở khổ 375px, tức cột chữ rời hẳn mép trên section và tụt xuống
        gần đúng khoảng giấy trống của bức tranh (tranh bắt đầu ở 466px).

        Vì sao cột chữ không nằm trọn trong tranh: ở khổ 375px cột chữ cao
        824px (bản tiếng Anh, dài hơn tiếng Việt chừng 45px) trong khi khoảng
        trống của tranh phóng 130% chỉ cao 589px — muốn nhét trọn thì phải
        phóng tranh lên gần 190%, lúc đó mái đình to gấp đôi và hai dải lụa
        mất gần hết. Nên cột chữ bắt đầu trên giấy kem rồi chảy vào tranh;
        `.seam-soft` làm hai thứ giấy đó liền nhau nên mắt không thấy ranh.

        Đo lại khi thêm chữ: cột chữ cao 715px (Việt) / 760px (Anh), còn mái
        đình — thứ chắn đầu tiên bên cột trái — bắt đầu ở 68% chiều cao
        tranh, tức 1056px tính từ đỉnh khung. Kéo `top` xuống quá 22% là chữ
        chạm mái.
      */}
      <div className="relative mx-auto w-full max-w-stage" style={{ aspectRatio: "9 / 32" }}>
        <Reveal className="absolute inset-x-0 top-[19%] flex w-[86%] flex-col items-start gap-block px-gutter text-left">
          <SectionHead
            eyebrow={t(weddingInfo.eyebrow)}
            title={t(weddingInfo.title)}
            titleId="wedding-info-title"
            align="left"
            flush
          >
            <Divider className="mt-stack max-w-[3.5rem]" />
          </SectionHead>

          <div className="flex flex-col gap-tight">
            <Eyebrow>{t(weddingInfo.saveTheDateLabel)}</Eyebrow>
            <Heading level="h3">{ceremony.dateShort}</Heading>
            <p className="text-lead">
              {t(ceremony.weekday)} · {ceremony.timeLabel}
            </p>
            <Caption>{t(ceremony.lunar)}</Caption>
          </div>

          <div className="flex flex-col gap-tight">
            <Eyebrow>{t(weddingInfo.venueLabel)}</Eyebrow>
            <Heading level="h3">{venue.name}</Heading>
            <p className="text-lead">{t(venue.hall)}</p>
            <Caption>{venue.address}</Caption>
          </div>

          <div className="flex flex-col gap-tight">
            <Eyebrow>{t(venue.directions.label)}</Eyebrow>
            {venue.directions.steps.map((step) => (
              <Caption key={step.vi}>{t(step)}</Caption>
            ))}
          </div>

          <ButtonLink href={venue.mapUrl} target="_blank" rel="noreferrer noopener">
            {t(venue.mapLabel)}
          </ButtonLink>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
