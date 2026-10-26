# brand/ — chỗ thả design system của khách

Bạn bỏ file vào đây và viết `direction.md`. Sau đó:

```bash
npm run assets
```

Lệnh này chép file sang `public/brand/`, đọc kích thước từng ảnh, rồi sinh
`content/assets.ts` — một bản kê **có kiểu**. Từ lúc đó, gắn asset vào section
là sửa khối `design` trong `content/client.ts`, và gõ sai tên file thì
TypeScript báo đỏ ngay chứ không âm thầm mất ảnh.

## Bốn thư mục, bốn vai trò

| Thư mục | Dùng làm gì | Nên là |
|---|---|---|
| `textures/` | Vân giấy / hoạ tiết lặp kín nền một section | ảnh **tile liền mạch**, 600–900px vuông, `.webp` |
| `backgrounds/` | Ảnh nền full-bleed của một section | ảnh dọc, cạnh dài ≥ 1600px, `.webp`/`.jpg` |
| `elements/` | Hoạ tiết rời: hoa, ruy băng, con dấu, monogram | **nền trong suốt**, `.webp`/`.png`/`.svg` |
| `dividers/` | Dải ngăn cưỡi lên đường nối hai section | ảnh lặp được theo chiều ngang, nền trong suốt |

Dải ngăn được tô bằng **màu chữ của section** qua CSS mask, nên file chỉ cần
đúng hình — màu trong file bị bỏ qua. Nhờ vậy một dải ren dùng được cho cả
section nền sáng lẫn nền tối.

## Đặt tên file

Tên file chính là tên dùng trong code, đưa về kebab-case:

```
brand/textures/Paper Cream.webp   →   "paper-cream"
brand/elements/hoa-sen-01.png     →   "hoa-sen-01"
```

Đặt tên theo **thứ nó là**, đừng theo chỗ nó đứng: `lily-left` tốt hơn
`hero-decor-1`, vì chỗ đứng có thể đổi còn bông hoa thì không. Hai file ra
cùng một tên thì file thứ hai bị bỏ qua và script báo cảnh báo.

Định dạng nhận: `.webp` `.png` `.jpg` `.jpeg` `.avif` `.svg`.

## Vài lưu ý về dung lượng

Script **không** nén lại ảnh — file bạn thả vào là file khách tải về. Nên
xuất `.webp` chất lượng 75–85 trước khi bỏ vào đây; một texture 2MB sẽ làm
chậm cả trang trên 3G, và khách xem thiệp cưới gần như toàn bằng 4G/điện thoại.

`public/brand/` là bản chép để phục vụ, **do script sinh ra** — xoá file khỏi
`brand/` rồi chạy lại là nó biến mất theo. Đừng sửa tay trong đó.

## Creative direction

Viết vào [`direction.md`](direction.md) — đó là nơi mình đọc để biết đặt cái gì
vào đâu. Chép từ `direction.example.md` rồi điền.

## Một dòng pixel đen ở mép trên

Bộ asset khách gửi (và mọi bản xuất lại từ `*-source/`) đều dính cùng một
lỗi: **hàng pixel đầu tiên của ảnh bị tối**, khoảng 176/255 trong khi phần
giấy còn lại là 253/255. Một dòng thôi, nhưng ảnh nền được `object-cover`
trải kín section nên dòng đó rơi đúng vào mép trên section — và hiện ra
thành một vạch ngang mảnh ở MỌI chỗ nối hai section.

`npm run assets` chỉ chép file, không sửa ảnh. Nên sau mỗi lần khách gửi file
mới, kiểm tra và vá trước khi chạy `npm run assets`:

```bash
python3 - <<'PY'
from PIL import Image
import glob
for p in glob.glob('brand/{backgrounds,elements,textures,dividers}/*.webp'):
    im = Image.open(p).convert('RGB'); W, H = im.size
    px = im.load()
    avg = lambda y: sum(sum(px[x, y]) for x in range(0, W, 8)) / (3 * len(range(0, W, 8)))
    if abs(avg(0) - avg(1)) > 12:
        im.paste(im.crop((0, 1, W, 2)), (0, 0))   # chép hàng thứ hai đè lên hàng đầu
        im.save(p, 'WEBP', quality=92, method=6)
        print('đã vá', p)
PY
```
