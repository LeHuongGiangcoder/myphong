"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { Ornaments, type OrnamentPlacement } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Seal } from "@/components/ui/Seal";
import { ceremony, venue, weddingInfo } from "@/content/client";

/**
 * Time & Venue — khi nào, và ở đâu. Dựng theo bản thiết kế khách gửi
 * (public/Time & Venue-html): một tờ giấy be vàng, đọc từ trên xuống theo thứ
 * tự người ta cần biết — ấn → ngày → giờ → nơi → đường vào → bản đồ.
 *
 * Ngày là tâm của trang: số "10" cỡ `poster` ở giữa, hai bên là hai ô viền
 * hai nét ("Chủ Nhật", "01 · 2027") — dòng chữ nhỏ kẹp giữa hai vạch ngang như
 * con dấu ngày tháng.
 *
 * Thẻ địa điểm có một dải hẹp bên phải trích từ chính bức tranh ở màn mở thiệp
 * (đoạn dải ren), để thẻ nối về cùng bộ tranh mà không phải nhân đôi cả tấm ảnh.
 *
 * Section không có ảnh nền nên mọi màu đi qua tông `garden` của theme.ts.
 */

/** Dải ren cắt từ `public/images/intro/background.webp`: phóng ~10 lần, đặt vào đoạn đặc nhất của ren. */
const LATTICE_STRIP = {
  src: "/images/intro/background.webp",
  size: "1020% auto",
  position: "40% 82%",
} as const;

/**
 * Sparkle nhân từ thiệp RSVP: đậu ở các góc quanh khối chữ, chỗ không có chữ
 * nào — chữ căn giữa, nên hai lề trên và dưới còn trống.
 */
const ORNAMENTS: readonly OrnamentPlacement[] = [
  { name: "sparkle-red", at: "left-[7%] top-[2.5%]", w: "9%" },
  { name: "sparkle-gold", at: "left-[4%] top-[25%]", w: "5%" },
  { name: "sparkle-red", at: "bottom-[6%] right-[7%]", w: "8%" },
];

export function WeddingInfo() {
  const { t } = useLocale();
  const [day, month, year] = ceremony.dateShort.split(" . ");
  const steps = venue.directions.steps;

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title">
      <div className="relative mx-auto w-full max-w-stage">
      <Ornaments items={ORNAMENTS} />
        <Reveal className="relative flex w-full flex-col items-center gap-block text-center text-tone-contrast">
          <div className="flex w-full flex-col items-center gap-stack">
            <Seal size="1.75rem" glyph="1.1rem" ring="0.1875rem" />
            <Eyebrow className="text-tone-muted">{t(weddingInfo.saveTheDateLabel)}</Eyebrow>

            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-tight">
              <p className="border-y border-tone-line py-tight text-eyebrow font-medium uppercase text-tone-fg">
                {t(ceremony.weekday)}
              </p>
              <Heading as="p" level="poster" className="font-light leading-[0.82] lining-nums text-tone-fg">
                {day}
              </Heading>
              <p className="border-y border-tone-line py-tight text-eyebrow font-medium uppercase text-tone-fg">
                {month} · {year}
              </p>
            </div>

            <p className="font-display text-h2 tracking-wider lining-nums text-tone-fg">
              {ceremony.timeLabel}
            </p>
            <p className="font-display text-base italic text-tone-muted">{t(ceremony.lunar)}</p>
          </div>

          {/* Thẻ địa điểm: khung kem hở một mép phải, nối sang dải ren hẹp */}
          <div className="flex w-full bg-camel text-left">
            <div className="m-2 mr-0 flex min-w-0 flex-1 flex-col gap-tight border border-r-0 border-ivory/70 p-stack">
              <Eyebrow className="text-tone-contrast">{t(weddingInfo.venueLabel)}</Eyebrow>
              <Heading
                level="h2"
                id="wedding-info-title"
                className="text-tone-fg"
              >
                {venue.name}
              </Heading>
              <p className="mt-tight text-small font-medium">{t(venue.hall)}</p>
              <p className="text-small">{venue.address}</p>
            </div>
            <div
              aria-hidden
              className="m-2 ml-0 w-tap border border-ivory/70 border-l-tone-line"
              style={{
                backgroundImage: `url(${LATTICE_STRIP.src})`,
                backgroundSize: LATTICE_STRIP.size,
                backgroundPosition: LATTICE_STRIP.position,
              }}
            />
          </div>

          <div className="flex w-full flex-col items-stretch gap-stack text-left">
            <Eyebrow className="text-tone-muted">{t(venue.directions.label)}</Eyebrow>
            <ol className="flex flex-col">
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <li
                    key={step.em.vi}
                    className={[
                      "relative flex gap-stack",
                      // Đường nối chảy từ viên thoi này xuống viên kế tiếp
                      last ? "" : "pb-stack before:absolute before:bottom-0 before:left-2.5 before:top-3.5 before:w-px before:bg-tone-line",
                    ].join(" ")}
                  >
                    <span className="mt-1 flex w-5 shrink-0 justify-center">
                      <span
                        aria-hidden
                        className={[
                          "relative z-10 size-2 rotate-45 border border-tone-accent",
                          last ? "bg-tone-fg" : "bg-tone-bg",
                        ].join(" ")}
                      />
                    </span>
                    <p className="text-small">
                      {step.before ? t(step.before) : null}
                      <span className="font-medium text-tone-fg">{t(step.em)}</span>
                      {step.after ? t(step.after) : null}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          <ButtonLink
            variant="primary"
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
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
