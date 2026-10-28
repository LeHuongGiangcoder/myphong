"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Seal } from "@/components/ui/Seal";
import { agenda } from "@/content/client";
import { du } from "@/content/intro";
import { element } from "@/lib/assets";

/**
 * Trình tự buổi lễ — một tấm khung hoạ tiết (bản thiết kế khách gửi, public/
 * Agenda-html): hàng medallion và chữ vạn ở đầu, hai dải ren hai bên, ảnh cặp
 * đôi ở đầu tấm giấy, rồi đường thời gian chạy dọc giữa với bốn mốc giờ đậu so le.
 *
 * Khung và mọi nét hoạ tiết là màu be đồng `camel` — cùng tông với thẻ địa điểm
 * ở Time & Venue — nét mảnh, không phải đỏ mận đậm như bản gốc nên khung nhẹ.
 * Mảng sáng của khung là `sand`.
 * Ấn 囍 vẫn son đỏ: nó là con dấu, không phải hoạ tiết.
 *
 * Khung vẽ trên máy 390 rộng, cao 930, và co theo BỀ NGANG: mọi toạ độ ở dưới là
 * đơn vị thiết kế (1 đơn vị = bề ngang khung / 390), `du()` quy ra CSS. Chữ và
 * khung phải dính nhau từng pixel nên đây là chỗ thứ hai (sau màn mở thiệp) được
 * phép bỏ luật "không số cứng" — màu thì vẫn đi qua theme.
 */

const W = 390;
const H = 930;

/** Tấm giấy bên trong khung, toạ độ trong khung. */
const PANEL = { x: 48, y: 94, w: 294, h: 740 };

/** Một mốc giờ: tâm đánh dấu nằm ở cột giữa x = 147 (toạ độ trong tấm giấy). */
const MARK = { axis: 147, first: 432, step: 78, textW: 108, textRise: 27 };

const FRAME = "stroke-camel";

/**
 * Sparkle nhân từ thiệp RSVP, đậu ở cạnh tiêu đề và chân đường thời gian. Toạ độ tính từ góc tấm giấy,
 * [x, y, bề ngang] theo đơn vị thiết kế; `flip` lật ngang.
 */
const ORNAMENTS = [
  { name: "sparkle-red", x: 236, y: 334, w: 24 },
  { name: "sparkle-gold", x: 58, y: 646, w: 14 },
  { name: "sparkle-red", x: 238, y: 714, w: 20 },
] as const;

/** Hoạ tiết lặp bám theo từng đường kẻ của khung — thiết kế gốc, chỉ đổi màu. */
const MEANDER = "M0 25 H19 V6 H6 V19 H13 V12 M19 25 H24";
const LATTICE_L = "M5 0 V36 M25 0 V36 M5 8 H17 V18 H25 M5 26 H13 V36 M17 18 V28 H25 M13 0 V4";
const LATTICE_R = "M25 0 V36 M5 0 V36 M25 8 H13 V18 H5 M25 26 H17 V36 M13 18 V28 H5 M17 0 V4";
const BALUSTRADE = "M0 4 H28 M0 26 H28 M2 26 V12 H12 V20 H7 M26 4 V18 H16 V10 H21";

function Medallion({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 45)`} fill="none" className={FRAME} strokeWidth="1.5">
      <circle r="21" className="fill-sand" />
      <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" />
      <circle r="5" />
      <path d="M0 -21 V-15.5 M0 21 V15.5 M-21 0 H-15.5 M21 0 H15.5" />
    </g>
  );
}

/** Bốn chấm hình thoi, đánh dấu hai đầu đường thời gian và chân khung. */
function Dots({ className, x, y }: { className: string; x: number; y: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className={className}
      style={{ left: du(x), top: du(y), width: du(18), height: du(18) }}
    >
      <circle cx="9" cy="3" r="1.6" />
      <circle cx="9" cy="15" r="1.6" />
      <circle cx="3" cy="9" r="1.6" />
      <circle cx="15" cy="9" r="1.6" />
    </svg>
  );
}

export function Agenda() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title" flush width="bleed">
      {/* Khung là một container để `cqw` quy về bề ngang của chính nó */}
      <div className="mx-auto w-full max-w-stage [container-type:inline-size]">
        <div
          className="relative w-full overflow-hidden"
          style={{ "--iu": "calc(100cqw / 390)", aspectRatio: `${W} / ${H}` } as CSSProperties}
        >
          {/* Khung: nền nâu đồng, mảng sáng, hoạ tiết lặp, ba medallion */}
          <svg
            aria-hidden
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="agenda-meander" width="24" height="31" patternUnits="userSpaceOnUse" x="78" y="10">
                <path d={MEANDER} fill="none" className={FRAME} strokeWidth="1.6" strokeLinecap="square" />
              </pattern>
              <pattern
                id="agenda-meander-flip"
                width="24"
                height="31"
                patternUnits="userSpaceOnUse"
                x="78"
                y="49"
                patternTransform="rotate(180 195 64.5)"
              >
                <path d={MEANDER} fill="none" className={FRAME} strokeWidth="1.6" strokeLinecap="square" />
              </pattern>
              <pattern id="agenda-lattice-l" width="30" height="36" patternUnits="userSpaceOnUse" x="10" y="94">
                <path d={LATTICE_L} fill="none" className={FRAME} strokeWidth="1.6" strokeLinecap="square" />
              </pattern>
              <pattern id="agenda-lattice-r" width="30" height="36" patternUnits="userSpaceOnUse" x="350" y="94">
                <path d={LATTICE_R} fill="none" className={FRAME} strokeWidth="1.6" strokeLinecap="square" />
              </pattern>
              <pattern id="agenda-balustrade" width="28" height="30" patternUnits="userSpaceOnUse" x="48" y="834">
                <path d={BALUSTRADE} fill="none" className={FRAME} strokeWidth="1.5" strokeLinecap="square" />
              </pattern>
            </defs>

            <rect width={W} height={H} className="fill-camel" />

            {/* Hàng đầu: hai ô vuông, dải ren giữa, ba medallion */}
            <rect x="10" y="10" width="58" height="70" className="fill-sand" />
            <rect x="322" y="10" width="58" height="70" className="fill-sand" />
            <rect x="78" y="10" width="234" height="70" className="fill-sand" />
            <rect x="78" y="10" width="234" height="31" fill="url(#agenda-meander)" />
            <rect x="78" y="49" width="234" height="31" fill="url(#agenda-meander-flip)" />
            <line x1="78" y1="45" x2="312" y2="45" className={FRAME} strokeWidth="1.5" />
            <Medallion x={39} />
            <Medallion x={351} />
            <Medallion x={195} />
            <line x1="10" y1="87" x2="380" y2="87" className="stroke-sand" strokeWidth="1" />

            {/* Hai dải ren dọc */}
            <rect x="10" y="94" width="30" height="770" className="fill-sand" />
            <rect x="10" y="94" width="30" height="770" fill="url(#agenda-lattice-l)" />
            <rect x="350" y="94" width="30" height="770" className="fill-sand" />
            <rect x="350" y="94" width="30" height="770" fill="url(#agenda-lattice-r)" />

            {/* Tấm giấy + hàng lan can ở chân */}
            <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} className="fill-parchment" />
            <rect x="48" y="834" width="294" height="30" className="fill-sand" />
            <rect x="48" y="834" width="294" height="30" fill="url(#agenda-balustrade)" />
            <line x1="10" y1="874" x2="380" y2="874" className="stroke-sand" strokeWidth="1" />
          </svg>

          <Dots className="absolute fill-sand" x={186} y={888} />

          {/* Nội dung nằm trong tấm giấy: toạ độ ở đây tính từ góc tấm giấy */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: du(PANEL.x),
              top: du(PANEL.y - 4),
              width: du(PANEL.w),
              height: du(PANEL.h + 4),
            }}
          >
            <Image
              src={agenda.photo}
              alt={t(agenda.photoAlt)}
              width={588}
              height={600}
              sizes="(max-width: 32rem) 80vw, 26rem"
              className="absolute left-0 object-cover"
              style={{ top: du(4), width: du(PANEL.w), height: du(300) }}
            />

            {/* Ấn treo từ mép ảnh xuống bằng một sợi dây */}
            <span
              aria-hidden
              className="absolute bg-camel"
              style={{ left: du(246), top: du(4), width: "1px", height: du(96) }}
            />
            <div className="absolute" style={{ left: du(230), top: du(100) }}>
              <Seal size={du(33)} glyph={du(20)} />
            </div>
            <span
              aria-hidden
              className="absolute bg-seal"
              style={{ left: du(246), top: du(133), width: "1px", height: du(20) }}
            />
            <span
              aria-hidden
              className="absolute rounded-full bg-seal"
              style={{ left: du(243), top: du(151), width: du(7), height: du(7) }}
            />

            {/* Cuộn mây ở mép dưới ảnh, lật ngang. Hoạ tiết nâu đồng, lòng sáng
                là màu giấy nên đổi tông là tự đổi theo. */}
            <svg
              aria-hidden
              viewBox="0 0 160 72"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute -scale-x-100"
              style={{ left: du(168), top: du(262), width: du(140), height: du(63) }}
            >
              <path className="stroke-camel" strokeWidth="1.6" d="M12 57 H108 C126 57 136 49 145 45 c6 -3 12 0 11 5 c-1 4 -6 4 -7 1" />
              <path className="stroke-camel" strokeWidth="1.6" d="M22 63 H98" />
              <circle cx="45" cy="44" r="11" className="fill-camel stroke-camel" />
              <path className="stroke-tone-bg" d="M45 44 a2.5 2.5 0 0 1 5 0 a5 5 0 0 1 -10 0 a7.5 7.5 0 0 1 15 0" />
              <circle cx="97" cy="43" r="12" className="fill-camel stroke-camel" />
              <path className="stroke-tone-bg" d="M97 43 a2.5 2.5 0 0 0 -5 0 a5 5 0 0 0 10 0 a7.5 7.5 0 0 0 -15 0" />
              <circle cx="70" cy="34" r="18" className="fill-camel stroke-camel" />
              <circle cx="70" cy="34" r="15.5" className="stroke-tone-bg" />
              <path className="stroke-tone-bg" d="M70 34 a3 3 0 0 1 6 0 a6 6 0 0 1 -12 0 a9 9 0 0 1 18 0" />
            </svg>

            <div className="absolute" style={{ left: du(22), top: du(328), width: du(250) }}>
              <p className="head-eyebrow m-0 text-tone-muted">
                {t(agenda.eyebrow)}
              </p>
              <h2
                id="agenda-title"
                className="head-title m-0 text-tone-fg"
                style={{ marginTop: du(10) }}
              >
                {t(agenda.title)}
              </h2>
            </div>

            {ORNAMENTS.map((o, i) => {
              const art = element(o.name);
              if (!art) return null;
              return (
                <Image
                  key={`${o.name}-${i}`}
                  src={art.src}
                  alt=""
                  aria-hidden
                  width={art.width ?? 100}
                  height={art.height ?? 100}
                  unoptimized
                  className={`pointer-events-none absolute h-auto select-none ${"flip" in o && o.flip ? "-scale-x-100" : ""}`}
                  style={{ left: du(o.x), top: du(o.y), width: du(o.w) }}
                />
              );
            })}

            {/* Đường thời gian: mờ dần hai đầu */}
            <span
              aria-hidden
              className="absolute"
              style={{
                left: du(MARK.axis),
                top: du(398),
                width: "1px",
                height: du(304),
                background:
                  "linear-gradient(to bottom, transparent, var(--t-color-camel) 10%, var(--t-color-camel) 90%, transparent)",
              }}
            />
            <Dots className="absolute fill-camel" x={138} y={712} />

            <ol className="m-0 list-none p-0">
              {agenda.items.map((item, i) => {
                const centre = MARK.first + i * MARK.step;
                const onRight = i % 2 === 1;
                return (
                  <Reveal as="li" key={`${item.time}-${i}`} delay={i * 80} className="list-none">
                    {/* Vạch ngắn nối đường thời gian với khối chữ */}
                    <span
                      aria-hidden
                      className="absolute bg-camel"
                      style={{
                        left: du(onRight ? MARK.axis + 11 : MARK.axis - 29),
                        top: du(centre),
                        width: du(18),
                        height: "1px",
                      }}
                    />
                    {item.highlight ? (
                      <div
                        className="absolute"
                        style={{ left: du(MARK.axis - 16), top: du(centre - 16) }}
                      >
                        <Seal size={du(26)} glyph={du(16)} ring={du(3)} />
                      </div>
                    ) : (
                      <span
                        aria-hidden
                        className="absolute rotate-45 border border-camel bg-tone-bg"
                        style={{
                          left: du(MARK.axis - 5),
                          top: du(centre - 5),
                          width: du(10),
                          height: du(10),
                        }}
                      />
                    )}
                    <div
                      className="absolute flex flex-col"
                      style={{
                        left: du(onRight ? MARK.axis + 33 : 6),
                        top: du(centre - MARK.textRise),
                        width: du(MARK.textW),
                        gap: du(5),
                        textAlign: onRight ? "left" : "right",
                        alignItems: onRight ? "flex-start" : "flex-end",
                      }}
                    >
                      <p
                        className="m-0 font-display lining-nums text-tone-fg"
                        style={{ fontSize: du(36), lineHeight: 0.9, fontWeight: item.highlight ? 400 : 300 }}
                      >
                        {item.time}
                      </p>
                      <p
                        className="m-0 font-display font-medium italic text-tone-contrast"
                        style={{ fontSize: du(19), lineHeight: 1.15 }}
                      >
                        {t(item.title)}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
