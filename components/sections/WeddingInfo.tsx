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
      {/* Khung cao hơn khổ tranh 9:16 để chừa cột giấy ở trên — xem ghi chú
          đầu file. Tranh tự neo xuống đáy bằng `at` trong client.ts.

          Tranh phóng 130% nên cao hơn khung 30%, mái đình — thứ chắn đầu
          tiên bên cột trái — dâng lên theo. Chọn tỉ lệ khung thì đo cột chữ
          ở BẢN TIẾNG ANH (dài hơn tiếng Việt khoảng 45px) rồi cộng thêm
          phần tranh nằm dưới mái đình. */}
      <div className="relative mx-auto w-full max-w-stage" style={{ aspectRatio: "9 / 27" }}>
        <Reveal className="absolute inset-x-0 top-0 flex w-[86%] flex-col items-start gap-block px-gutter pt-section text-left">
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
