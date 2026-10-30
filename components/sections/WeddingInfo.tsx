"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { Butterfly } from "@/components/ui/Butterfly";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, venue, weddingInfo } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Time & Venue — khi nào, và ở đâu. Đọc từ trên xuống: lời mời + ảnh cổng vòm
 * → ngày và giờ → địa điểm + bản đồ → đường vào phòng tiệc.
 *
 * Hai dải sen là hoạ tiết rời của khách (brand/elements/lotus-*): một dải ôm
 * mép trái ở đầu trang, một dải trồi từ mép phải ở nửa dưới. Đặt ở chỗ ít đè
 * chữ, `opacity` để nguyên 1.
 *
 * Section không có ảnh nền nên mọi màu đi qua tông `garden` của theme.ts.
 */

const lotusTop = element("lotus-left-top");
const lotusStem = element("lotus-left-stem");
const lotusRight = element("lotus-right");

/*
  Số đo lấy từ bản audit (public/Time & Venue · bình phong (audit)-html, khổ 390 × 900).
  Ngang tính theo % của khung chứa để co theo máy; dọc để rem. Một số khoảng cách
  (16, 42, 51px…) không rơi vào bậc token nào — đây là ngoại lệ có chủ ý của section này.
*/

/** Lề trái cột chữ: sau đường kẻ dọc (91px / 390). */
const TEXT_INDENT = "pl-[20.5%]";

export function WeddingInfo() {
  const { t } = useLocale();
  const [day, month, year] = ceremony.dateShort.split(" . ");
  const steps = venue.directions.steps;

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title" flush>
      <div className="relative mx-auto w-full max-w-stage pt-[3.375rem]">
        <Reveal className="relative flex w-full flex-col text-tone-contrast">
          <div className="relative pb-[3.1875rem]">
            {/* Đường kẻ dọc gần lề trái: từ đỉnh section xuống tới đường kẻ ngang của phần đường vào */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[3.375rem] bottom-0 left-[16%] w-px bg-tone-line"
            />
            {/*
              Sen trái: lật ngang cho hoa quay về phía ảnh đôi. Mép phải của khung sen chạm
              đường kẻ dọc, mép trái trôi ra ngoài màn hình. Ảnh cắt làm hai — đầu sen (giữ
              nguyên) và đoạn cuống ở chân (kéo dãn theo chiều dọc) — để cuống chạm xuống
              đường kẻ ngang của phần đường vào.
            */}
            {lotusTop && lotusStem ? (
              <div
                aria-hidden
                className="pointer-events-none absolute -left-[30%] bottom-0 top-[3rem] flex w-[48%] origin-bottom rotate-[2.5deg] flex-col"
              >
                <Image
                  src={lotusTop.src}
                  alt=""
                  width={lotusTop.width ?? 100}
                  height={lotusTop.height ?? 100}
                  unoptimized
                  className="h-auto w-full shrink-0 -scale-x-100 select-none"
                />
                <div className="relative min-h-0 flex-1">
                  <Image
                    src={lotusStem.src}
                    alt=""
                    fill
                    unoptimized
                    className="-scale-x-100 select-none object-fill"
                  />
                </div>
              </div>
            ) : null}
            <div className={`flex flex-col ${TEXT_INDENT}`}>
              {/* Lời mời + ảnh cổng vòm. Khung ảnh nhô lên 30px so với dòng mời, tràn ra sát mép phải màn hình, đáy ngang gạch đứt dưới "Thời gian". */}
              <div className="grid grid-cols-[minmax(0,1fr)_46%] items-start">
                <div className="relative flex min-h-[15.75rem] flex-col justify-between pt-[1.875rem]">
                  {/* Con bướm nằm giữa "Save the Date" và "Thời gian", trong khoảng trống bên trái ảnh. */}
                  <Butterfly className="absolute right-[18%] top-[48%] w-[32%]" />
                  <div className="flex flex-col gap-3">
                    <Eyebrow className="whitespace-nowrap text-tone-muted [--head-eyebrow-tracking:0.2em]">
                      {t(weddingInfo.inviteLabel)}
                    </Eyebrow>
                    <Heading
                      level="h2"
                      className="whitespace-pre-line text-tone-fg"
                    >
                      {t(weddingInfo.saveTheDateLabel)}
                    </Heading>
                  </div>
                  <SubHead>{t(weddingInfo.timeLabel)}</SubHead>
                </div>
                <div className="-mr-[calc(var(--spacing-gutter)-2px)] aspect-[146/250] w-auto rounded-t-full border border-tone-accent p-[5px]">
                  <div className="relative size-full overflow-hidden rounded-t-full">
                    <Image
                      src={weddingInfo.photo}
                      alt={t(weddingInfo.photoAlt)}
                      fill
                      sizes="(max-width: 32rem) 42vw, 14rem"
                      className="object-cover object-[50%_25%]"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-stack grid grid-cols-[auto_1px_auto] items-start justify-between gap-x-[1rem]">
                <div className="flex flex-col">
                  <Eyebrow className="text-tone-muted">
                    {t(ceremony.weekday)}
                  </Eyebrow>
                  <p className="mt-2 font-display text-h1 lining-nums leading-none text-tone-fg">
                    {day}.{month}.{year}
                  </p>
                </div>
                <span aria-hidden className="h-[5.25rem] w-px bg-tone-line" />
                <div className="flex flex-col">
                  <Eyebrow className="text-tone-muted">
                    {t(weddingInfo.receptionLabel)}
                  </Eyebrow>
                  <p className="mt-2 font-display text-h1 lining-nums leading-none text-tone-fg">
                    {ceremony.timeLabel}
                  </p>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="mt-[2.625rem] flex flex-col items-start">
                <SubHead>{t(weddingInfo.venueLabel)}</SubHead>
                <Heading
                  level="h2"
                  id="wedding-info-title"
                  className="mt-4 text-tone-fg"
                >
                  {venue.name}
                </Heading>
                <p className="mt-2 text-small font-medium">{t(venue.hall)}</p>
                <p className="mt-[3px] text-small">{venue.address}</p>
                <ButtonLink
                  variant="primary"
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-[1.125rem] gap-tight"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden
                  >
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.4" />
                  </svg>
                  {t(venue.mapLabel)}
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Đường vào phòng tiệc — cùng màu giấy, căn giữa, ngăn bằng một đường kẻ mảnh kéo hết bề ngang */}
          <div className="relative flex flex-col items-center pb-[2.6875rem] pr-[10%] pt-[1.625rem] text-center before:absolute before:inset-x-[-100vw] before:top-0 before:h-px before:bg-tone-line">
            {/* Lá sen: cao hơn phần đường vào để ngọn hơi chạm đường kẻ ngang, chân chạm đáy section */}
            {lotusRight ? (
              <Image
                aria-hidden
                src={lotusRight.src}
                alt=""
                width={lotusRight.width ?? 100}
                height={lotusRight.height ?? 100}
                unoptimized
                className="pointer-events-none absolute bottom-0 -right-[12%] h-[calc(100%+0.5rem)] w-auto max-w-none select-none"
              />
            ) : null}
            <Eyebrow className="text-tone-muted">
              {t(venue.directions.label)}
            </Eyebrow>
            <ol className="mt-[0.875rem] flex w-fit max-w-[78%] flex-col gap-2 text-left">
              {steps.map((step, i) => (
                <li key={step.em.vi} className="flex items-center gap-tight">
                  <span
                    aria-hidden
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-tone-fg font-display text-small leading-none lining-nums text-tone-fg"
                  >
                    {i + 1}
                  </span>
                  <p className="text-small">
                    {step.before ? t(step.before) : null}
                    <span className="font-medium text-tone-fg">
                      {t(step.em)}
                    </span>
                    {step.after ? t(step.after) : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

/** Tiêu đề nhỏ của một khối ("Thời gian", "Địa điểm"): chữ display + gạch đứt ngắn bên dưới. */
function SubHead({ children }: { children: string }) {
  return (
    <div className="flex flex-col items-start gap-tight">
      <Heading level="h3" className="text-tone-fg">
        {children}
      </Heading>
      <span
        aria-hidden
        className="w-10 border-t border-dashed border-tone-accent"
      />
    </div>
  );
}
