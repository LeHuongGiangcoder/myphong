"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

import { useGuest } from "@/components/experience/GuestProvider";
import { useLocale } from "@/components/experience/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { Heading, Script, SectionHead } from "@/components/ui/Heading";
import { Choice, Field, FieldLabel, Stepper } from "@/components/ui/Field";
import { Ornaments, type OrnamentPlacement } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { rsvp } from "@/content/client";
import { element } from "@/lib/assets";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Tấm thiệp được vẽ rộng hơn khung chứa 20% mỗi chiều (10% tràn ra mỗi bên),
 * để ô giấy rộng ra cho form thoáng. Phần tràn
 * bị `overflow-x-clip` của SectionWrapper cắt. Đổi số này thì đổi cả
 * `px-[…]`, `pt-[…]`, `pb-[…]` của khối nội dung bên dưới theo cùng tỉ lệ.
 */
const CARD_BLEED = "w-[120%] -translate-x-1/2 left-1/2";

/** Ba lát thiệp trải đúng bề ngang của thiệp (120% khung), không phải của màn hình. */
const CARD_SIZES = "(max-width: 32rem) 120vw, 39rem";

/**
 * Hoa đỏ và sparkle — trước đây rải ở ĐẦU thiệp (cạnh mái ngói, đèn lồng) làm
 * phần đầu quá nhiều hoạ tiết. Giờ chúng được gỡ khỏi lát trên (xem
 * scripts/recolor-paper.mjs) và đặt lại ở khoảng GIỮA section, hai bên tấm
 * giấy, nơi form dài và trống nhất.
 *
 * `at` tính theo % của KHUNG thiệp (cao theo form), `w` là % bề ngang khung —
 * kích thước giữ đúng tỉ lệ so với khi còn nằm trên tranh gốc. Hai dải lề bên
 * ngoài tấm giấy chỉ còn ~11% mỗi bên (thiệp đã phóng 120%), nên không hoạ tiết nào rộng quá ~10%.
 */
const MID_ORNAMENTS: readonly OrnamentPlacement[] = [
  { name: "sparkle-red", at: "left-[1%] top-[34%]", w: "9%" },
  { name: "flower-red-right", at: "right-0 top-[41%]", w: "6.7%" },
  { name: "sparkle-gold", at: "right-[5%] top-[49%]", w: "5%" },
  { name: "flower-red-left", at: "left-0 top-[53%]", w: "5.4%" },
  { name: "sparkle-red", at: "right-[3%] top-[63%]", w: "8%" },
  { name: "sparkle-gold", at: "left-[6%] top-[70%]", w: "4.6%" },
] as const;

/**
 * Hai đèn lồng treo ở đỉnh thiệp, đung đưa nhẹ như có gió. Trong tranh gốc chúng
 * bị cắt ở mép ảnh rồi bị 10% tràn của thiệp cắt thêm; sprite (xem
 * scripts/recolor-paper.mjs) đã được dựng lại nguyên chiếc, ở đây chỉ việc đặt
 * chúng xịch vào trong vùng nhìn thấy (10%–90% bề ngang thiệp).
 *
 * `at` + `w` tính theo % bề ngang KHUNG thiệp; sprite rộng nhất ở trục dây treo
 * nên `left` = tâm − w/2. `delay`/`duration` lệch nhau để hai đèn không đung
 * đưa đồng pha.
 */
const LANTERNS = [
  { name: "lantern-left", left: "9.8%", w: "13.5%", delay: "0s", duration: "6.5s" },
  { name: "lantern-right", left: "77%", w: "12%", delay: "-2.4s", duration: "7.5s" },
] as const;

/**
 * Form RSVP — chế độ `general`: một form mở, ai có link site cũng trả lời được.
 *
 * Bảy câu hỏi, hỏi dần theo câu trả lời:
 *
 *   họ tên · số điện thoại · khách nhà trai hay nhà gái · có đến không
 *     ↳ có đến  → đi mấy người
 *         ↳ nhiều hơn một → tên những người đi cùng
 *   lời chúc
 *
 * Dữ liệu đi thẳng tới Glow RSVP Hub theo đúng hợp đồng trong skill glow-rsvp:
 *
 *   • POST, Content-Type `text/plain;charset=utf-8` — để Apps Script không
 *     dính CORS preflight (nó không trả lời được preflight).
 *   • Body là MỘT object phẳng: `client` + đúng các field của form.
 *   • Không gửi key rỗng và không gửi state của giao diện (status, step…).
 *   • Hub tự đổi "yes"/"no" thành Có/Không, nên gửi nguyên chuỗi đó.
 *
 * Giá trị gửi lên luôn là tiếng Việt, kể cả khi khách đang đọc bản tiếng Anh
 * — cột trong Sheet phải nhất quán để gia đình đọc được.
 *
 * Thêm hay đổi tên field ở đây thì phải chạy lại:
 *   ~/glow-tools/glow-rsvp.sh fields <client> --fields "key=Nhãn;…"
 *
 * `rsvp.endpoint` còn trống (chưa nối Sheet) thì form vẫn chạy đủ và báo
 * thành công, chỉ không gửi đi đâu cả.
 */
export function Rsvp() {
  const { guest } = useGuest();
  const { t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [side, setSide] = useState("");
  const [partySize, setPartySize] = useState(1);

  /* Ba lát thiệp. Thiếu file nào thì phần đó im lặng biến mất, form vẫn
     chạy — xem lib/assets.ts. */
  const cardTop = element("rsvp-card-top");
  const cardMid = element("rsvp-card-mid");
  const cardBottom = element("rsvp-card-bottom");

  const personalized = rsvp.mode === "personalized";
  const fields = rsvp.fields;

  const going = attending === "yes";
  /* Chỉ hỏi tên người đi cùng khi có người đi cùng để mà kể tên. */
  const withGuests = going && partySize > 1;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Thứ tự các key ở đây chính là thứ tự cột trong Sheet của khách.
    const values: Record<string, string | number> = {
      name: guest?.name ?? String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      side,
      attending,
      partySize: going ? partySize : 0,
      companions: withGuests ? String(data.get("companions") ?? "").trim() : "",
      message: String(data.get("message") ?? "").trim(),
    };

    // Khách vào bằng link mời riêng: gửi kèm slug để hub ghi đúng dòng của họ.
    if (personalized && guest?.slug) values.slug = guest.slug;

    // Không gửi key rỗng — cột trống trong Sheet là rác.
    for (const [key, value] of Object.entries(values)) {
      if (value === "") delete values[key];
    }

    setStatus("sending");

    if (!rsvp.endpoint || !rsvp.client) {
      // Chưa chạy skill glow-rsvp. Vẫn cho khách thấy màn cảm ơn khi dựng thử.
      console.info("[rsvp] chưa nối hub, dữ liệu sẽ gửi:", values);
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ client: rsvp.client, ...values }),
      });
      const payload = (await res.json()) as { ok?: boolean };
      setStatus(payload?.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionWrapper section="rsvp" flush width="bleed" labelledBy="rsvp-title">
      {/*
        TẤM THIỆP CO GIÃN.

        Bức tranh của khách vẽ sẵn một tấm thiệp: đèn lồng, mây, và
        một ô giấy có viền ở giữa. Ô đó cao 366px ở khổ điện thoại, còn bảy
        câu hỏi cao hơn 900px — nên tấm giấy phải kéo dài ra theo form.

        Cách làm: cắt bức tranh làm ba lát theo chiều dọc và xếp lại bằng flex.

          rsvp-card-top     đèn lồng + mép trên ô giấy         (cao cố định)
          rsvp-card-mid     20px "chỉ giấy + hai vạch viền"    (flex-1, lặp)
          rsvp-card-bottom  mép dưới ô giấy + mây              (cao cố định)

        Lát giữa cắt ở y 1101–1120 của bản 1080×1920 — đoạn duy nhất trong cả
        bức mà ngoài khung lẫn trong khung đều chỉ còn giấy. Độ lệch chuẩn
        theo chiều dọc của dải đó là 1,3/255 nên lặp lại không thấy vệt ngang.

        Nội dung nằm trong `padding` tính theo % BỀ NGANG (padding % luôn ăn
        theo bề ngang, kể cả trên/dưới) nên mép chữ giữ đúng khoảng cách tới
        viền ở mọi khổ máy. Viền dọc ở 17,2% và 81,9%, mép trong trên ở 47,9%,
        dưới 32,5% — nhưng `padding` rộng hơn thế, vì hai góc giấy có hoạ tiết
        chữ triện vẽ sẵn: góc trên trái buông xuống tới 72% và góc dưới phải
        dâng lên 19% trên mép dưới. Chữ bắt đầu SAU hai hoạ tiết đó, không đè
        lên, và chừa hẳn một quãng giấy trống hai bên.
      */}
      <div className="relative mx-auto w-full max-w-stage">
        {/* Tấm thiệp không tan mép: đèn lồng ở đỉnh và dãy mây ở đáy phải
            còn nguyên. Chỗ nối với section bên cạnh do `.seam-blur` của
            SectionWrapper lo. */}
        <div aria-hidden className={`absolute inset-y-0 flex flex-col ${CARD_BLEED}`}>
          {cardTop ? (
            <Image
              src={cardTop.src}
              alt=""
              width={cardTop.width ?? 1080}
              height={cardTop.height ?? 1101}
              sizes={CARD_SIZES}
              quality={95}
              className="w-full"
            />
          ) : null}

          <div
            className="relative flex-1"
            style={
              cardMid
                ? {
                    backgroundImage: `url(${cardMid.src})`,
                    backgroundRepeat: "repeat-y",
                    backgroundSize: "100% auto",
                  }
                : undefined
            }
          >
          </div>

          {cardBottom ? (
            <Image
              src={cardBottom.src}
              alt=""
              width={cardBottom.width ?? 1080}
              height={cardBottom.height ?? 799}
              sizes={CARD_SIZES}
              quality={95}
              className="w-full"
            />
          ) : null}
        </div>

        <div aria-hidden className={`pointer-events-none absolute inset-y-0 ${CARD_BLEED}`}>
          {LANTERNS.map((l) => {
            const art = element(l.name);
            if (!art) return null;
            return (
              <Image
                key={l.name}
                src={art.src}
                alt=""
                width={art.width ?? 200}
                height={art.height ?? 650}
                unoptimized
                className="absolute top-0 h-auto origin-top animate-sway-soft select-none motion-reduce:animate-none"
                style={{ left: l.left, width: l.w, animationDelay: l.delay, animationDuration: l.duration }}
              />
            );
          })}
        </div>

        <Ornaments items={MID_ORNAMENTS} />

        {/* `flush` ở SectionHead: khối này đã có `gap-block` của flex, nếu để
            SectionHead giữ `mb-block` của nó thì dưới tiêu đề thành hai lần
            khoảng cách. `pt` cũng rút lại — chữ triện ở góc trên trái buông
            xuống tới 40% bề ngang lát thiệp trên (mái đã bỏ, mép giấy nâng lên ngang
            điểm giữa hai đèn lồng), 38% là vừa chạm chân nó. */}
        <div className="relative flex flex-col gap-block px-[18%] pt-[38%] pb-[55%]">
          <SectionHead
            eyebrow={t(rsvp.eyebrow)}
            title={personalized && guest ? `${t(rsvp.greeting)} ${guest.name}` : t(rsvp.title)}
            titleId="rsvp-title"
            flush
          />

          <Reveal>
        {status === "sent" ? (
          <div role="status" className="flex flex-col items-center gap-stack text-center">
            <Heading level="h3">{t(rsvp.successTitle)}</Heading>
            <Script>{t(rsvp.successNote)}</Script>
            <Button variant="outline" onClick={() => setStatus("idle")}>
              {t(rsvp.editAnswer)}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-block">
            {/* Khách đã có tên trong Sheet thì khỏi hỏi lại */}
            {personalized && guest ? null : (
              <Field label={t(fields.name.label)} htmlFor="rsvp-name">
                <input
                  id="rsvp-name"
                  name="name"
                  required
                  autoComplete="name"
                  maxLength={80}
                  placeholder={t(fields.name.placeholder)}
                  className="field-input"
                />
              </Field>
            )}

            <Field label={t(fields.phone.label)} htmlFor="rsvp-phone">
              <input
                id="rsvp-phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder={t(fields.phone.placeholder)}
                className="field-input"
              />
            </Field>

            <fieldset className="flex flex-col gap-tight">
              <FieldLabel as="legend">{t(fields.side.label)}</FieldLabel>
              {/* Hai lựa chọn đứng cạnh nhau: một hàng thay vì hai dòng cao
                  44px, và nhãn ngắn nên vẫn đọc thoải mái. */}
              <div className="grid grid-cols-2 gap-x-stack">
                {fields.side.options.map((option) => (
                  <Choice
                    key={option.value}
                    name="side"
                    value={option.value}
                    checked={side === option.value}
                    onChange={() => setSide(option.value)}
                    required
                  >
                    {t(option.label)}
                  </Choice>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-tight">
              <FieldLabel as="legend">{t(fields.attending.label)}</FieldLabel>
              <div className="grid grid-cols-2 gap-x-stack">
                <Choice
                  name="attending"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                >
                  {t(fields.attending.yes)}
                </Choice>
                <Choice
                  name="attending"
                  value="no"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                >
                  {t(fields.attending.no)}
                </Choice>
              </div>
            </fieldset>

            {going ? (
              <fieldset className="flex flex-col gap-tight">
                <FieldLabel as="legend">{t(fields.partySize.label)}</FieldLabel>
                <Stepper
                  value={partySize}
                  onChange={setPartySize}
                  min={fields.partySize.min}
                  max={fields.partySize.max}
                  decreaseLabel={t(fields.partySize.decrease)}
                  increaseLabel={t(fields.partySize.increase)}
                >
                  {partySize} {t(partySize === 1 ? fields.partySize.unit.one : fields.partySize.unit.many)}
                </Stepper>
              </fieldset>
            ) : null}

            {withGuests ? (
              <Field label={t(fields.companions.label)} htmlFor="rsvp-companions">
                <textarea
                  id="rsvp-companions"
                  name="companions"
                  required
                  maxLength={400}
                  placeholder={t(fields.companions.placeholder)}
                  className="field-input"
                />
              </Field>
            ) : null}

            <Field label={t(fields.message.label)} htmlFor="rsvp-message">
              <textarea
                id="rsvp-message"
                name="message"
                maxLength={600}
                placeholder={t(fields.message.placeholder)}
                className="field-input"
              />
            </Field>

            <div className="flex flex-col items-center gap-stack">
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? t(rsvp.sending) : t(rsvp.submit)}
              </Button>
              {status === "error" ? (
                <p role="alert" className="text-small text-tone-accent">
                  {t(rsvp.errorNote)}
                </p>
              ) : null}
            </div>
          </form>
        )}
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
