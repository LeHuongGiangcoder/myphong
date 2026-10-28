# Glow Garden · Mobile-first 9:16

Bộ hình và animation dựng lại từ minh họa be vàng đã duyệt. Mặt trời, tán cây và hai con bướm là các asset độc lập. Phần bị che của mặt trời và cây được vẽ bổ sung; bướm được vẽ ở tư thế mở cánh để tạo chuyển động.

## Mở bản demo

Giải nén và mở `index.html` trong trình duyệt hiện đại. Nếu công cụ hoặc trình duyệt chặn file local, chạy một static server tại thư mục này, ví dụ `python3 -m http.server 8080`, rồi mở `http://localhost:8080`.

- `index.html`: bản demo có nút tạm dừng, phát lại và thanh chỉnh tốc độ mặt trời.
- `embed.html`: ví dụ nhúng tối giản, chỉ có tranh.
- `component/garden.js` + `component/garden.css`: component độc lập, không cần framework, npm, CDN hay build.
- `assets/png/`: ảnh PNG gốc; mặt trời, tán cây và bướm có nền trong suốt.
- `assets/webp/`: bản nhẹ dùng trên web, tổng khoảng 583 KiB cho năm ảnh duy nhất. Ảnh dùng lại được cache.
- `assets/manifest.json`: kích thước, đường dẫn, dung lượng và thông tin nền trong suốt.

## Nhúng vào web

Copy cả thư mục `glow-garden-mobile` vào thư mục static/public. Giữ nguyên quan hệ đường dẫn giữa `component/` và `assets/`.

```html
<script src="/glow-garden-mobile/component/garden.js" defer></script>

<glow-garden
  sun-duration="32"
  wind-duration="7"
  flight-duration="18"
  flap-duration="0.46"
  style="width:100%;max-width:480px;margin-inline:auto"
></glow-garden>
```

Component dùng Shadow DOM để CSS của web chủ không làm lệch bố cục. Tỉ lệ luôn là 9:16 và chiều rộng theo container. Nội dung web có thể đặt lên tranh qua slot:

```html
<glow-garden>
  <div style="position:absolute;inset:66% 8% auto;text-align:center">
    <!-- Đặt nội dung thiệp tại đây -->
  </div>
</glow-garden>
```

Với React/Next có thể tải script bằng cơ chế script phía client của dự án rồi dùng custom element này. Đây là thành phần chạy trong trình duyệt; không render trực tiếp mã component trên server.

## Chỉnh chuyển động

Thời lượng tính bằng giây. Số lớn hơn nghĩa là chuyển động chậm hơn. `sun-duration` là một lượt từ trái sang phải; lượt quay về mất cùng thời gian, tạo vòng lặp liền mạch.

| Thuộc tính HTML | Mặc định | Chức năng |
| --- | --- | --- |
| `sun-duration` | `32` | Thời gian một lượt di chuyển mặt trời |
| `wind-duration` | `7` | Chu kỳ cây đung đưa |
| `flight-duration` | `18` | Chu kỳ đường bay của bướm trắng; bướm sẫm lệch nhịp |
| `flap-duration` | `0.46` | Thời gian gập/mở cánh bướm trắng; bướm sẫm có nhịp riêng trong CSS |
| `paused` | không có | Thêm thuộc tính này để dừng toàn bộ chuyển động |

Các biến dưới đây đặt trực tiếp trên `glow-garden` hoặc trong CSS của web chủ:

```css
glow-garden {
  --sun-left: 24%;    /* Vị trí ban đầu, theo chiều rộng tranh */
  --sun-top: 20%;     /* Theo chiều cao tranh */
  --sun-width: 62%;
  --sun-travel: 12%;  /* Quãng đường ngang, theo chiều rộng tranh */
  --wind-angle: 1.7deg;
  --bamboo-top: 19%;
  --bamboo-left: -7%;
  --bamboo-width: 98%;
}
```

Giữ tổng `--sun-left` + `--sun-width` + `--sun-travel` dưới 100% nếu muốn mặt trời không chạm mép phải. Cây trong demo đi ra từ mép trái giống bố cục gốc; file PNG vẫn chứa cả gốc cành và các đầu lá.

```js
const garden = document.querySelector('glow-garden');
garden.pause();
garden.play();
garden.restart();
garden.setAttribute('sun-duration', '45');
```

## Cấu trúc lớp khi tự dựng bằng GSAP/CSS

| Thứ tự từ sau ra trước | Asset / cách hiển thị |
| --- | --- |
| 0. Nền | `background.webp`, phủ đủ 9:16 |
| 1. Mặt trời | `sun-full.webp`, ảnh tròn đầy đủ, chuyển động bằng transform |
| 2. Khung che | Dùng lại `background.webp`, clip từ mép trái tới 60.1% bề ngang để mặt trời đi phía sau khung |
| 3. Cây | `bamboo.webp`, xoay nhẹ quanh gốc tại 5% / 94% |
| 4. Bướm | Mỗi ảnh bướm được hiển thị qua ba lớp clip CSS: cánh trái, cánh phải, thân/râu. Cánh gập bằng rotateY, đường bay nằm ở wrapper riêng |
| 5. Nội dung | Slot trên cùng, dành cho nội dung web |

Bướm không phải GIF/video. Hai cánh và thân dùng lại một ảnh nguồn qua `clip-path`, nên có thể chỉnh nhịp đập và đường bay độc lập mà không tải thêm sprite sheet. Mặt trời là asset đầy đủ; việc che nửa trái chỉ diễn ra trong bố cục demo. Muốn mặt trời đi phía trước khung, đổi z-index của `.sun-motion` thành `3` và của `.bamboo` thành `4` trong `component/garden.css`.

## Hiệu năng và khả năng truy cập

- WebP giữ alpha cho asset trong suốt; PNG dành cho thiết kế và xuất lại.
- Chỉ animation bằng transform; không dùng timer để vẽ từng frame.
- Dừng animation khi component rời viewport hoặc tab bị ẩn.
- Tôn trọng `prefers-reduced-motion`: tự hiển thị cảnh tĩnh, nút điều khiển demo bị vô hiệu hóa.
- Không có font bên ngoài, analytics hoặc yêu cầu mạng ngoài thư mục asset.
- Đã kiểm tra tải ảnh ở chiều rộng 320 / 375 / 390 / 430 px, không tràn ngang; kiểm tra pause toàn bộ tám animation, restart và thay đổi thời lượng mặt trời bằng thanh điều khiển. Nên kiểm tra thêm trong web đích vì container, CSP và cách tải script tùy dự án.

## Nguồn hình

Các asset được vẽ lại bằng công cụ tạo ảnh tích hợp dựa trên minh họa đã duyệt. Prompt chính: tách nền không có chủ thể; mặt trời vàng đất hình tròn đầy đủ; tán lá mực sepia đầy đủ; hai bướm nhìn từ trên với cánh mở, nền trong suốt. Giữ bảng màu be, vàng đất, kem và nét minh họa Á Đông. Chỉ resize và chuyển định dạng khi xuất bản WebP.
