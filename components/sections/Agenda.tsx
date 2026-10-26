"use client";

import { useLocale } from "@/components/experience/LocaleProvider";
import { Eyebrow, Heading, Lead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { agenda } from "@/content/client";

/**
 * Trình tự buổi lễ, rải dọc dải sen của khách.
 *
 * Dải sen uốn hình chữ S từ trên phải xuống dưới trái, chừa ra năm ô giấy
 * trống so le hai bên. Tên section nằm ô trên cùng bên trái, rồi bốn mốc giờ
 * đi xuống theo đúng đường cong — mắt bám theo bức tranh chứ không theo một
 * trục dọc kẻ sẵn.
 *
 * NĂM TOẠ ĐỘ NÀY LÀ ĐO, KHÔNG PHẢI ƯỚC LƯỢNG. Cách đo: quét độ tương phản
 * giữa màu chữ và từng điểm ảnh của bức tranh, rồi với mỗi đoạn lấy vị trí có
 * ít diện tích vướng mực nhất. Kết quả: ô trên-trái 2,5% · phải 28% 0,1% ·
 * trái 47% 0,0% · phải 68% 0,0% · trái đáy 0,2%.
 *
 * Hệ quả cần nhớ khi sửa:
 *
 *   • Toạ độ tính bằng PHẦN TRĂM của khung tranh, không phải px — khung luôn
 *     giữ đúng khổ 9:16 nên ô trống rơi vào cùng chỗ ở mọi khổ máy.
 *   • Mỗi mục chỉ được cao khoảng 68px, tức GIỜ + TÊN, không có dòng thứ ba.
 *     Thêm ghi chú vào là khối cao 112–134px và tràn ra lá sen (mục đầu tiên
 *     không còn chỗ sạch nào — xem lịch sử git).
 *   • Thêm mục thứ năm thì phải đo lại; dải sen chỉ chừa đúng bốn ô.
 *
 * Mục bám mép nào thì chữ căn theo mép đó, để khối chữ ôm lấy đường cong.
 */
const SLOTS = [
  "right-0 top-[28%] items-end text-right",
  "left-0 top-[47%] items-start text-left",
  "right-0 top-[68%] items-end text-right",
  "left-0 bottom-0 items-start text-left",
] as const;

export function Agenda() {
  const { t } = useLocale();

  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title" flush width="bleed">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-stage">
        {/* Góc trên trái — ô giấy trống rộng nhất của bức tranh. Bề ngang
            chặn ở 46%: rộng hơn là mép phải tiêu đề chạm vào lá sen. */}
        <Reveal className="absolute left-0 top-0 flex w-[46%] flex-col gap-tight px-gutter text-left">
          <Eyebrow>{t(agenda.eyebrow)}</Eyebrow>
          <Heading level="h2" id="agenda-title">
            {t(agenda.title)}
          </Heading>
          <Lead>{t(agenda.intro)}</Lead>
        </Reveal>

        <ol>
          {agenda.items.map((item, i) => {
            const slot = SLOTS[i];
            if (!slot) return null;
            return (
              <Reveal
                as="li"
                key={`${item.time}-${i}`}
                delay={i * 90}
                className={`absolute flex w-[45%] flex-col gap-tight px-gutter ${slot}`}
              >
                <p className="font-display text-h4 text-tone-accent">{item.time}</p>
                <Heading level="h4">{t(item.title)}</Heading>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
