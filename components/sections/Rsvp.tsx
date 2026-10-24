"use client";

import { useState, type FormEvent } from "react";

import { useGuest } from "@/components/experience/GuestProvider";
import { useLocale } from "@/components/experience/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { Caption, Heading, Script, SectionHead } from "@/components/ui/Heading";
import { Choice, Field, FieldLabel } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { rsvp } from "@/content/client";

type Status = "idle" | "sending" | "sent" | "error";

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
    <SectionWrapper section="rsvp" width="prose" labelledBy="rsvp-title">
      <SectionHead
        eyebrow={t(rsvp.eyebrow)}
        title={
          personalized && guest ? `${t(rsvp.greeting)} ${guest.name}` : t(rsvp.title)
        }
        titleId="rsvp-title"
        intro={t(rsvp.note)}
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
            </fieldset>

            <fieldset className="flex flex-col gap-tight">
              <FieldLabel as="legend">{t(fields.attending.label)}</FieldLabel>
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
            </fieldset>

            {going ? (
              <fieldset className="flex flex-col gap-tight">
                <FieldLabel as="legend">{t(fields.partySize.label)}</FieldLabel>
                {Array.from({ length: fields.partySize.max }, (_, i) => i + 1).map((n) => (
                  <Choice
                    key={n}
                    name="partySize"
                    value={String(n)}
                    checked={partySize === n}
                    onChange={() => setPartySize(n)}
                  >
                    {n === 1 ? t(fields.partySize.one) : `${n} ${t(fields.partySize.unit)}`}
                  </Choice>
                ))}
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
              <Caption>{t(rsvp.deadline)}</Caption>
              {status === "error" ? (
                <p role="alert" className="text-small text-tone-accent">
                  {t(rsvp.errorNote)}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </Reveal>
    </SectionWrapper>
  );
}
