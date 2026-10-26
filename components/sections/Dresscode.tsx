"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Caption, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { dresscode } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Trang phục: một câu dẫn và bảng màu.
 *
 * Ô màu đọc hex thẳng từ client.ts — đây là chỗ duy nhất trong site được phép
 * nhận mã màu từ nội dung, vì bảng màu là nội dung của khách chứ không phải
 * theme của site.
 */
export function Dresscode() {
  const { t } = useLocale();

  /* Vầng mặt trời cắt ra từ chính bức tranh của khách, giữ nguyên nét cọ và
     rìa loang. File chỉ còn alpha nên dùng làm mask: đổ màu nào thì ra vầng
     màu đó. Thiếu file thì rơi về ô màu vuông. */
  const sun = element("sun");

  return (
    <SectionWrapper section="dresscode" flush width="bleed" labelledBy="dresscode-title">
      {/*
        Bức tranh của khách: vài nhành tre rất nhạt ở góc trên, dãy núi mực
        nâu và vầng mặt trời hồng ở chân tranh. Quét tương phản cho thấy chỉ
        đoạn 77%–90% (dãy núi) là vướng — toàn bộ phần trên đọc được ở mọi bề
        ngang, nên chữ cứ căn giữa như bình thường, chỉ cần dừng trước núi.
      */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-stage">
        <div className="container-prose absolute inset-x-0 top-[6%] flex flex-col items-center">
      <SectionHead
        eyebrow={t(dresscode.eyebrow)}
        title={t(dresscode.title)}
        titleId="dresscode-title"
      />

      <Reveal className="flex flex-col items-center gap-stack text-center">
        <Heading level="h3">{t(dresscode.headline)}</Heading>
        <Caption className="max-w-prose">{t(dresscode.note)}</Caption>
      </Reveal>

      {dresscode.swatches.length > 0 ? (
        <Reveal delay={90} className="mt-block flex flex-col items-center gap-stack">
          <ul className="grid w-full max-w-[18rem] grid-cols-4 gap-stack">
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
          {dresscode.avoid ? <Caption className="text-center">{t(dresscode.avoid)}</Caption> : null}
        </Reveal>
      ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}
