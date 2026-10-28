# Cổng Huế — đã archive

Màn mở thiệp dạng cảnh động (hai cánh cổng tách ra, ánh vàng, mây, dòng sáng,
rồi đẩy qua ô cửa vào hero). Đã được thay bằng cổng Bình phong
(`components/ui/Garden.tsx`, `content/intro.ts`). Thư mục này **không nằm trong
build**: `tsconfig.json` và `eslint.config.mjs` đều loại trừ `archive/`.

| File | Vai trò | Trả về |
|---|---|---|
| `Gateway.tsx` | canvas vẽ cảnh | `components/ui/Gateway.tsx` |
| `gateway.ts` | nhịp + toạ độ | `content/gateway.ts` |
| `Intro.tsx` | màn mở thiệp bản cũ | `components/sections/Intro.tsx` |
| `images/` | 11 layer WebP | `public/images/gateway/` |

Bộ asset gốc (guide, master PNG, demo) vẫn ở `brand/hue-gateway-intro/`.

## Bật lại

1. Chép bốn thứ trên về đúng chỗ (bảng trên).
2. `content/client.ts`: thêm lại `gateway?: boolean` vào `SectionDesign`, đặt
   `design.intro` về `{ tone: "dark", gateway: true, background: "/images/intro.jpg", overlay: 0.55, seam: false }`
   và khôi phục khối `intro` (`eyebrow: "Save the Date"`, `note`, `cta`, `hint`).
3. `content/theme.ts`: palette vẫn còn `night` và `lantern` cho cảnh này.
4. Xoá `components/ui/Garden.tsx` + `content/intro.ts` nếu không dùng nữa.
