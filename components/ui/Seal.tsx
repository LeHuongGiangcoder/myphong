/** Noto Serif TC chỉ tải đúng một ký tự 囍 (U+56CD) — vài trăm byte thay vì cả font Hán. */
const SEAL_FONT =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&text=%E5%9B%8D&display=swap";

/**
 * Ấn 囍 son đỏ: một ô vuông chữ kem, bọc viền kem và một nét thau mảnh. Không
 * đổ bóng — viền kem là thứ làm ấn nổi lên khỏi nền, không phải cái bóng.
 *
 * Bỏ `ring` thì chỉ còn ô son trơn (không viền kem). Cỡ truyền vào dưới dạng độ
 * dài CSS (`size` là cạnh ô son, `ring` là bề dày viền kem) để cùng một ấn dùng
 * được ở nhiều nơi: màn mở thiệp và Agenda tính theo đơn vị thiết kế (`du()`),
 * Time & Venue tính theo rem. Component tự nạp font nên nơi
 * dùng không phải nhớ.
 */
export function Seal({ size, glyph, ring }: { size: string; glyph: string; ring?: string }) {
  const tile = (
    <div
      aria-hidden
      className="flex items-center justify-center rounded-paper bg-seal"
      style={{ width: size, height: size }}
    >
      <span lang="zh-Hant" className="font-cjk font-bold leading-none text-ivory" style={{ fontSize: glyph }}>
        囍
      </span>
    </div>
  );

  return (
    <>
      <link rel="stylesheet" href={SEAL_FONT} precedence="default" />
      {ring ? (
        <div aria-hidden className="rounded-card border border-brass/60 bg-ivory" style={{ padding: ring }}>
          {tile}
        </div>
      ) : (
        tile
      )}
    </>
  );
}
