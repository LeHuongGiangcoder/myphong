"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, Script, SectionHead } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, families, venue, weddingInfo } from "@/content/client";
import { googleCalendarUrl } from "@/lib/calendar";

/**
 * Time & Venue — thiệp mời chính: gia đình hai bên, ngày giờ, địa điểm.
 *
 * Trên điện thoại ba khối xếp dọc; từ md trở lên ảnh nằm cạnh khối chữ. Mọi
 * khoảng cách đi qua gap-block / gap-stack nên nhịp giống hệt các section khác.
 */
export function WeddingInfo() {
  const { lang, t } = useLocale();

  return (
    <SectionWrapper section="weddingInfo" labelledBy="wedding-info-title">
      <SectionHead
        eyebrow={t(weddingInfo.eyebrow)}
        title={t(weddingInfo.title)}
        titleId="wedding-info-title"
        intro={t(weddingInfo.intro)}
      />

      {/* --- Gia đình hai bên ------------------------------------- */}
      <Reveal className="flex flex-col items-center gap-block md:flex-row md:items-start md:justify-center">
        {families.map((family) => (
          <div key={family.side.vi} className="flex flex-col items-center gap-tight text-center">
            <Eyebrow>{t(family.side)}</Eyebrow>
            <ul className="flex flex-col gap-tight">
              {family.people.map((person) => (
                <li key={person.name} className="font-display text-h4">
                  <span className="text-tone-muted">{t(person.role)} </span>
                  {person.name}
                </li>
              ))}
            </ul>
            <Caption>{family.home}</Caption>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-block flex justify-center">
        <Divider diamond />
      </Reveal>

      {/* --- Ngày giờ + địa điểm + ảnh ---------------------------- */}
      <div className="mt-block flex flex-col items-center gap-block md:flex-row md:items-center md:justify-center">
        <Reveal className="w-full max-w-[20rem]">
          <ImageFrame
            src={weddingInfo.photo}
            alt={t(weddingInfo.photoAlt)}
            ratio="4 / 5"
            sizes="(max-width: 48rem) 80vw, 20rem"
          />
        </Reveal>

        <Reveal delay={90} className="flex flex-col items-center gap-stack text-center">
          <div className="flex flex-col items-center gap-tight">
            <Eyebrow>{t(weddingInfo.saveTheDateLabel)}</Eyebrow>
            <Heading level="h2">{ceremony.dateShort}</Heading>
            <Caption>
              {t(ceremony.weekday)} · {ceremony.timeLabel}
            </Caption>
            <Caption>{t(ceremony.lunar)}</Caption>
          </div>

          <Divider />

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
      </div>
    </SectionWrapper>
  );
}
