"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Caption, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { dresscode } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Trang phục: một câu dẫn và bảng màu gợi ý (tám ô, hai hàng bốn).
 *
 * Ô màu đọc hex thẳng từ client.ts — đây là chỗ duy nhất trong site được phép
 * nhận mã màu từ nội dung, vì bảng màu là nội dung của khách chứ không phải
 * theme của site.
 */
/** Kích thước tranh gốc và các hàng cắt (px trong ảnh 1080 × 2300). */
const PLATE = { w: 1080, h: 2300, topEnd: 850, mountainStart: 1540, mountainEnd: 2200 } as const;
const SIZES = "(max-width: 32rem) 100vw, 32rem";

export function Dresscode() {
  const { t } = useLocale();

  /* Vầng mặt trời cắt ra từ chính bức tranh của khách, giữ nguyên nét cọ và
     rìa loang. File chỉ còn alpha nên dùng làm mask: đổ màu nào thì ra vầng
     màu đó. Thiếu file thì rơi về ô màu vuông. */
  const sun = element("sun");
  const plate = element("dresscode");

  return (
    <SectionWrapper section="dresscode" flush width="bleed" labelledBy="dresscode-title">
      {/*
        Bức tranh của khách (1080×2300) có ba vùng — quét độ phủ theo hàng cho thấy:

          0 → 800     vài nhành tre rất nhạt ở góc trên
          800 → 1540  giấy trống hoàn toàn
          1540 → 2200 dãy núi mực nâu, tan dần về trong suốt ở ~2150

        Trước đây cả bức được trải nguyên, nên giữa chữ và núi hở một khoảng giấy
        trống rất lớn, và chân section bị cắt ngang ở hàng 2050 — lúc đó núi còn
        đặc nên thành một đường cắt cứng. Giờ bức tranh được CẮT THÀNH HAI LÁT
        bỏ đoạn giấy trống: lát tre neo đỉnh, lát núi nằm ngay dưới chữ và được
        giữ trọn tới hàng 2200, nơi núi đã tan hẳn nên không có mép cắt. Thêm một
        lớp mask tan dần ở chân lát núi cho chắc, và `.seam-blur` của SectionWrapper
        nhoè nốt chỗ nối sang section dưới.
      */}
      <div className="relative mx-auto w-full max-w-stage">
        {plate ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
              style={{ aspectRatio: `${PLATE.w} / ${PLATE.topEnd}` }}
            >
              <Image
                src={plate.src}
                alt=""
                width={PLATE.w}
                height={PLATE.h}
                sizes={SIZES}
                quality={95}
                className="absolute left-0 top-0 h-auto w-full"
              />
            </div>
          </>
        ) : null}

        <div className="container-prose relative flex flex-col items-center gap-block pt-[14%]">
          <SectionHead
            eyebrow={t(dresscode.eyebrow)}
            title={t(dresscode.title)}
            titleId="dresscode-title"
          />

          {dresscode.swatches.length > 0 ? (
            <Reveal delay={90} className="flex flex-col items-center gap-stack">
              <ul className="grid w-full max-w-[20rem] grid-cols-4 gap-stack">
                {dresscode.swatches.map((swatch) => (
                  <li key={swatch.hex} className="flex flex-col items-center gap-tight text-center">
                    <span
                      aria-hidden
                      className="aspect-square w-full"
                      style={
                        sun
                          ? {
                              backgroundColor: swatch.hex,
                              maskImage: `url(${sun.src})`,
                              WebkitMaskImage: `url(${sun.src})`,
                              maskRepeat: "no-repeat",
                              WebkitMaskRepeat: "no-repeat",
                              maskSize: "contain",
                              WebkitMaskSize: "contain",
                              maskPosition: "center",
                              WebkitMaskPosition: "center",
                            }
                          : { backgroundColor: swatch.hex }
                      }
                    />
                    <span className="text-small text-tone-muted">{t(swatch.name)}</span>
                  </li>
                ))}
              </ul>
              {dresscode.avoid ? (
                <Caption className="text-center">{t(dresscode.avoid)}</Caption>
              ) : null}
            </Reveal>
          ) : null}
        </div>

        {plate ? (
          <div
            aria-hidden
            className="pointer-events-none relative overflow-hidden"
            style={{
              aspectRatio: `${PLATE.w} / ${PLATE.mountainEnd - PLATE.mountainStart}`,
              maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
            }}
          >
            <Image
              src={plate.src}
              alt=""
              width={PLATE.w}
              height={PLATE.h}
              sizes={SIZES}
              quality={95}
              className="absolute left-0 h-auto w-full"
              style={{ top: `${(-PLATE.mountainStart / (PLATE.mountainEnd - PLATE.mountainStart)) * 100}%` }}
            />
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
}
