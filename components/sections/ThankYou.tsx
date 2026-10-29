"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Divider } from "@/components/ui/Divider";
import { Lead, Script, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { thankYou } from "@/content/client";

/**
 * Màn cuối: ảnh cưới phủ kín màn hình, bốn góc tan vào giấy, chữ nằm trên ảnh.
 *
 * Ba thứ phải đi cùng nhau ở đây:
 *
 *   • `.edge-feather` làm mép ảnh trong suốt dần (mask, không phải lớp phủ
 *     màu) nên nền giấy của section hiện qua — ảnh chìm vào thiệp thay vì bị
 *     cắt bằng một khung chữ nhật.
 *   • Chữ nằm trên ảnh nên khối chữ bọc trong `data-tone="dark"`: mọi
 *     component con tự lấy màu của tông tối (chữ kem) mà không phải truyền
 *     prop, đúng cách SectionWrapper vẫn làm.
 *   • Dải tối ở chân ảnh để chữ đọc được. Đo độ sáng ở khổ full màn: nửa
 *     dưới ảnh có trung vị 0,09 nhưng 5% điểm sáng tới 0,34 (cát bắt nắng),
 *     chữ kem đặt trần lên đó sẽ chìm ở đúng những chỗ đó.
 */
export function ThankYou() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="thankYou" labelledBy="thank-you-title" flush width="bleed">
      <div className="relative min-h-[100svh] w-full">
        {/* `.edge-feather` trên chính tấm ảnh làm bốn góc tan vào giấy, nên
            ảnh chìm vào thiệp chứ không bị cắt bằng khung chữ nhật. Chỗ nối
            với tấm thiệp RSVP ở trên do `.seam-blur` của SectionWrapper lo —
            không chồng thêm mask ở đây. */}
        {thankYou.image ? (
          <div className="absolute inset-0">
            <Image
              src={thankYou.image}
              alt={t(thankYou.imageAlt)}
              fill
              sizes="100vw"
              className="fade-top object-cover"
            />
          </div>
        ) : null}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-t from-espresso/86 via-espresso/78 via-82% to-transparent"
        />

        {/* Khối chữ bám sát chân ảnh. Không chừa `mb-tap` cho nút nhạc: chữ
            căn giữa còn nút nằm sát mép phải, hai bên không chạm nhau — và
            đẩy chữ xuống thấp cho phép dải tối ngắn lại 8%, tức ảnh hở ra
            thêm chừng ấy. */}
        <div
          data-tone="dark"
          /*
            Bỏ màu nhấn tím của tông tối, CHỈ ở section này: eyebrow, câu dẫn
            và chữ script lấy luôn màu chữ chính. Trên ảnh cưới, một màu nhấn
            khác sắc không đọc ra thành "chữ được nhấn" mà thành "chữ bị ám
            màu". Màn mở thiệp và hero giữ nguyên màu nhấn cũ.

            Đặt thẳng biến ở đây chứ không làm class trong `@layer components`:
            khối `[data-tone]` do layout.tsx in ra nằm ngoài mọi layer, nên
            CSS trong layer luôn thua nó dù specificity cao hơn.
          */
          style={
            {
              "--t-section-accent": "var(--t-section-fg)",
              "--t-section-muted": "var(--t-section-fg)",
            } as CSSProperties
          }
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-stack px-gutter pb-section text-center text-tone-fg"
        >
          <SectionHead
            eyebrow={t(thankYou.eyebrow)}
            title={t(thankYou.title)}
            titleId="thank-you-title"
            flush
          />

          <Divider diamond />

          <Reveal className="flex flex-col gap-tight">
            {thankYou.lines.map((line, i) => (
              <Lead key={i}>{t(line)}</Lead>
            ))}
          </Reveal>

          <Reveal delay={120} className="flex flex-col items-center gap-tight">
            <Script>{thankYou.signature}</Script>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
