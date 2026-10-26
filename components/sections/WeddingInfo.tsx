"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, venue, weddingInfo } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Time & Venue — khi nào, và ở đâu.
 *
 * BỨC TRANH CẮT LÀM HAI, CHỮ NGỒI VÀO KHOẢNG GIẤY GIỮA.
 *
 * Bức tranh của khách (1080×1920) có đúng một khoảng giấy trống, và nó không
 * đủ rộng để chứa cột chữ. Quét mực theo từng hàng cho thấy:
 *
 *   0 → 19,6%    dải lụa hồng, có chỗ quét sát mép trái
 *   19,6 → 51%   GIẤY TRỐNG, sạch trên toàn bộ bề ngang
 *   51 → 100%    mái đình, dải lụa xanh, hàng cây
 *
 * Khoảng trống đó chỉ cao 31% bức tranh. Phóng tranh lên cho nó chứa nổi cột
 * chữ (715px tiếng Việt / 760px tiếng Anh) thì phải phóng gần 280% — mái
 * đình to gấp ba, hỏng bức tranh. Neo tranh xuống đáy rồi để chữ chảy từ
 * giấy kem vào tranh thì chữ đè lên dải lụa hồng.
 *
 * Nên bức tranh được CẮT ở 35% — giữa khoảng giấy trống, chỗ sạch nhất — rồi
 * xếp lại: lát trên neo đỉnh section, lát dưới neo đáy, cột chữ nằm trên
 * giấy giữa hai lát. Giấy đó giãn ra theo chiều dài của chữ, nên bản tiếng
 * Anh dài hơn cũng không đẩy chữ vào tranh. Cùng cách làm với tấm thiệp RSVP
 * (components/sections/Rsvp.tsx), chỉ khác là ở đây hai lát không cần lát
 * nối vì nền giữa chúng chính là vân giấy của section.
 *
 * Ba khối thông tin dùng CHUNG một nhịp bốn bậc, nhờ đó mắt đọc được thứ tự:
 *
 *   nhãn nhỏ in hoa (eyebrow)  →  cái tên (h3)  →  dòng phụ (lead)  →  chữ
 *   nhỏ nhạt (caption)
 */

/**
 * Bốn con số dưới đây đi cùng nhau — đổi ảnh timevenue là phải quét lại mực
 * rồi sửa cả bốn.
 *
 *   SCALE   tranh rộng 130% bề ngang khung, tràn đều hai bên
 *   CUT     chỗ cắt, tính theo chiều cao tranh
 *   TOP/BOT chiều cao mỗi lát, viết thành tỉ lệ khung hình của vỏ cắt
 *           (bề ngang khung : chiều cao lát) = 1 : SCALE × 16/9 × phần tranh
 */
const PLATE = {
  /** 1 : 1,3 × 1920/1080 × 0,35 */
  topRatio: "1000 / 809",
  /** 1 : 1,3 × 1920/1080 × 0,65 */
  bottomRatio: "1000 / 1502",
} as const;

export function WeddingInfo() {
  const { t } = useLocale();
  const art = element("timevenue");

  /* Chỉ MÉP CẮT mới cần tan: lát trên tan ở đáy, lát dưới tan ở đỉnh. Hai
     con số nằm gọn trong phần giấy trống của mỗi lát (44% và 25% chiều cao
     lát) nên vùng tan không bao giờ liếm vào nét vẽ.

     Mép ngoài (đỉnh và đáy section) để 0: chỗ nối với section bên cạnh do
     `.seam-blur` của SectionWrapper lo, tan thêm ở đây là chồng hai lớp
     thành một dải nhạt. */
  const topSeam = { "--seam-top": "0%", "--seam-bottom": "26%" } as CSSProperties;
  const bottomSeam = { "--seam-top": "16%", "--seam-bottom": "0%" } as CSSProperties;

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title" flush width="bleed">
      <div className="relative mx-auto w-full max-w-stage">
        {art ? (
          <>
            <div
              aria-hidden
              className="seam-soft pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
              style={{ ...topSeam, aspectRatio: PLATE.topRatio }}
            >
              <Image
                alt=""
                src={art.src}
                width={art.width ?? 1080}
                height={art.height ?? 1920}
                sizes="(max-width: 32rem) 130vw, 42rem"
                quality={95}
                className="absolute left-1/2 top-0 w-[130%] max-w-none -translate-x-1/2"
              />
            </div>

            <div
              aria-hidden
              className="seam-soft pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden"
              style={{ ...bottomSeam, aspectRatio: PLATE.bottomRatio }}
            >
              <Image
                alt=""
                src={art.src}
                width={art.width ?? 1080}
                height={art.height ?? 1920}
                sizes="(max-width: 32rem) 130vw, 42rem"
                quality={95}
                className="absolute bottom-0 left-1/2 w-[130%] max-w-none -translate-x-1/2"
              />
            </div>
          </>
        ) : null}

        {/*
          `pt` / `pb` tính theo % BỀ NGANG khung (padding % luôn ăn theo bề
          ngang) nên chữ giữ đúng khoảng cách tới hai lát tranh ở mọi khổ
          máy. Mỗi con số là chiều cao lát trừ đi phần giấy trống của lát đó:
          chữ tụt vào vùng giấy ấy một quãng, nhờ vậy không có hai khoảng
          trắng thừa trên dưới.
        */}
        <Reveal className="relative flex w-full flex-col items-start gap-block px-gutter pt-[52%] pb-[124%] text-left">
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
