"use client";

import Image from "next/image";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { Ornaments, type OrnamentPlacement } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, venue, weddingInfo } from "@/content/client";

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

const ORNAMENTS: readonly OrnamentPlacement[] = [
  // Lật ngang để hoa quay về phía ảnh đôi
  { name: "lotus-left", at: "-left-[12%] top-[2%]", w: "34%", flip: true },
  // Lá sen chạm đáy section (bù phần đệm dưới của SectionWrapper)
  { name: "lotus-right", at: "-bottom-section -right-[8%]", w: "30%" },
];

/** Lề trái của cột chữ: chừa chỗ cho đường kẻ dọc và dải sen bên trái. */
const TEXT_INDENT = "pl-[22%]";

export function WeddingInfo() {
  const { t } = useLocale();
  const [day, month, year] = ceremony.dateShort.split(" . ");
  const steps = venue.directions.steps;

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title">
      <div className="relative mx-auto w-full max-w-stage">
        <Ornaments items={ORNAMENTS} />
        {/* Đường kẻ dọc gần lề trái, chạy suốt chiều cao section */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-section -top-section left-[16%] w-px bg-tone-line"
        />

        <Reveal className="relative flex w-full flex-col gap-block text-tone-contrast">
          <div className={`flex flex-col gap-block ${TEXT_INDENT}`}>
            {/* Lời mời + ảnh cổng vòm */}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-stack">
              <div className="flex flex-col gap-stack">
                <Eyebrow className="text-tone-muted">{t(weddingInfo.inviteLabel)}</Eyebrow>
                <Heading level="h2" className="text-tone-fg">
                  {t(weddingInfo.saveTheDateLabel)}
                </Heading>
              </div>
              <div className="w-full rounded-t-full border border-tone-accent p-tight">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-full">
                  <Image
                    src={weddingInfo.photo}
                    alt={t(weddingInfo.photoAlt)}
                    fill
                    sizes="(max-width: 32rem) 40vw, 14rem"
                    className="object-cover object-top"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex flex-col gap-stack">
              <SubHead>{t(weddingInfo.timeLabel)}</SubHead>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-stack">
                <div className="flex flex-col gap-tight">
                  <Eyebrow className="text-tone-muted">{t(ceremony.weekday)}</Eyebrow>
                  <p className="font-display text-h1 lining-nums leading-none text-tone-fg">
                    {day}.{month}
                  </p>
                  <p className="font-display text-h4 tracking-[0.3em] lining-nums text-tone-muted">
                    {year}
                  </p>
                </div>
                <div className="flex flex-col gap-tight border-l border-tone-line pl-stack">
                  <Eyebrow className="text-tone-muted">{t(weddingInfo.receptionLabel)}</Eyebrow>
                  <p className="font-display text-h1 italic lining-nums leading-none text-tone-fg">
                    {ceremony.timeLabel}
                  </p>
                </div>
              </div>
              <p className="font-display text-base italic text-tone-muted">{t(ceremony.lunar)}</p>
            </div>

            {/* Địa điểm */}
            <div className="flex flex-col items-start gap-stack">
              <SubHead>{t(weddingInfo.venueLabel)}</SubHead>
              <div className="flex flex-col gap-tight">
                <Heading level="h2" id="wedding-info-title" className="text-tone-fg">
                  {venue.name}
                </Heading>
                <p className="mt-tight text-small font-medium">{t(venue.hall)}</p>
                <p className="text-small">{venue.address}</p>
              </div>
              <ButtonLink
                variant="outline"
                href={venue.mapUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="gap-tight"
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

          {/* Đường vào phòng tiệc — cùng màu giấy, ngăn bằng một đường kẻ mảnh kéo hết bề ngang */}
          <div
            className={`relative flex flex-col gap-stack pt-block text-left before:absolute before:inset-x-[-100vw] before:top-0 before:h-px before:bg-tone-line ${TEXT_INDENT}`}
          >
            <Eyebrow className="text-tone-muted">{t(venue.directions.label)}</Eyebrow>
            <ol className="flex flex-col gap-stack">
              {steps.map((step, i) => (
                <li key={step.em.vi} className="flex items-center gap-stack">
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-tone-accent font-display text-small lining-nums text-tone-fg"
                  >
                    {i + 1}
                  </span>
                  <p className="text-small">
                    {step.before ? t(step.before) : null}
                    <span className="font-medium text-tone-fg">{t(step.em)}</span>
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
      <span aria-hidden className="w-10 border-t border-dashed border-tone-accent" />
    </div>
  );
}
