# Huế Gateway: layer và animation guide

Bộ dựng cảnh 2.5D từ hai artwork đã chốt. Click **Open** sẽ mở cửa, hé sáng, đẩy mây từ chân cổng và làm dòng sáng lan ra tiền cảnh. Tổng thời gian đề xuất: **4,8 giây**. Không tự chạy khi load trang.

## 1. Dùng bộ này

1. Giải nén, đưa toàn bộ `assets/`, `manifest.json`, guide này và `VIBE-CODING-PROMPT.txt` vào tool.
2. Chạy `demo.html` để xem cách dựng và kéo thanh timeline để kiểm tra từng thời điểm.
3. Nếu mở file trực tiếp gặp hạn chế, chạy `python -m http.server 8000` trong thư mục và mở `http://localhost:8000/demo.html`.
4. `layer-contact-sheet.jpg` cho biết nội dung từng layer. Mọi PNG đăng ký theo canvas **1080 × 1920**, không auto-trim.

**Lưu ý nguồn:** Hai file đầu vào thực tế là 941 × 1672, đã được chuẩn hóa về 1080 × 1920. Việc tăng kích thước không tạo thêm chi tiết gốc. Đây là bộ layer tái dựng từ ảnh phẳng, không phải file PSD gốc hay scene 3D.

## 2. Cách hiểu chuyển động cửa

End frame chỉ hé một ô sáng hẹp ở giữa, không mở toàn bộ chiều ngang của cổng. Bản demo chọn **hai cánh cửa hẹp trượt sang hai bên, khuất sau hai trụ cố định**. Cách này giữ đúng hình học của hai artwork.

Không xoay hai mảng đen lớn ra ngoài: chúng được giữ làm khung/trụ trong cách dựng này. Nếu muốn cửa xoay bản lề với góc nhìn 3D thật, cần thêm hình mặt bên và mặt sau cánh cửa hoặc dựng mesh. Hai ảnh phẳng hiện tại không chứa các bề mặt đó.

## 3. Layer và thứ tự xếp

| Thứ tự | File | Vai trò | Blend |
| --- | --- | --- | --- |
| 0 | `00-base-closed.webp` | Nền cố định gồm núi, kiến trúc Huế, mặt nước và cửa đóng | normal |
| 10 | `10-portal-interior.png` | Cảnh vàng bên trong, chỉ nằm trong ô cửa | normal |
| 20 | `20-door-left.png` | Cánh trái từ start frame, canvas đầy đủ | normal |
| 21 | `21-door-right.png` | Cánh phải từ start frame, canvas đầy đủ | normal |
| 30 | `30-portal-frame-open.png` | Khung cổng và trần có ánh hắt của end frame | normal |
| 40 | `40-river-light.png` | Texture ánh sáng sông đã tách, alpha thật | screen |
| 41 | `41-threshold-spill.png` | Vùng ánh sáng hắt xuống mặt nước ở ngưỡng cửa | screen |
| 50 | `50-mountain-bounce-optional.png` | Ánh vàng phản nhẹ lên vùng núi gần | screen |
| 61 | `61-fog-left.png` | Mây trôi về trái | normal |
| 62 | `61-fog-right.png` | Mây trôi về phải | normal |
| 99 | `99-reference-open.webp` | End frame chuẩn để đối chiếu và hòa hình ở cuối | normal |

File hỗ trợ:

- `20-door-left-crop.png`, `21-door-right-crop.png`: bản crop nhẹ để animate. Dùng thay cho bản full canvas, không dùng cả hai.
- `31-portal-light.png`: phương án screen cho ánh hắt cổng. Dùng **thay** layer 30 nếu muốn giữ texture khung đóng; không cộng cả hai vì sẽ sáng quá.
- `60-fog-bank.png`: mây nguyên dải. Dùng thay hai lớp mây tách khi cần phương án đơn giản.
- `river-reveal-path.svg`: đường dẫn thô cho mask sông. Đây là guide, không phải đường nét để hiển thị. Cần tinh chỉnh nếu dùng stroke reveal thay cho mask mềm theo chiều dọc.
- Bản `.png` của start/end dùng làm master, `.webp` dùng cho runtime.

`40` và `41` được tính từ phần tăng sáng giữa hai frame, nên không thể hoàn nguyên toàn bộ khác biệt màu và texture của hai ảnh. Layer mây được tái dựng riêng bằng imagegen để có alpha và chuyển động độc lập; không phải tách được nguyên vẹn khói gốc. Layer 50 là hiệu ứng bổ sung chủ động, không phải ánh sáng đã tồn tại chính xác trong end frame.

## 4. Tọa độ cần giữ

Hệ tọa độ dùng canvas 1080 × 1920, gốc trên trái.

| Vùng | x | y | w | h |
| --- | ---: | ---: | ---: | ---: |
| Ô cửa để clip | 457 | 343 | 167 | 974 |
| Crop cánh trái | 457 | 343 | 83 | 974 |
| Crop cánh phải | 540 | 343 | 84 | 974 |

- Đường tiếp giáp cửa: `x = 540`.
- Chân cửa: khoảng `y = 1317`, tức 68,59% chiều cao.
- Cánh trái dịch từ `0 → -83px`, cánh phải `0 → +84px`, theo hệ 1080px. Luôn clip vào ô cửa.
- Cảnh bên trong đặt dưới cửa từ đầu; khi cửa tách ra thì tự lộ. Không fade cả cảnh vào đồng thời trên cánh cửa.
- Tất cả layer nằm chung một canvas/stage. Không dùng `object-fit` khác nhau cho từng layer.

## 5. Timeline đề xuất

| Khoảng giây | Chuyển động | Cách xử lý |
| --- | --- | --- |
| 0,00–0,25 | Nút Open mất dần, nhịp chờ rất ngắn | Chặn click lặp, chưa cho sáng bừng |
| 0,25–2,75 | Hai cánh tách từ giữa | Ease in-out cubic, có quán tính nhẹ, không bounce |
| 0,28–2,55 | Trần và mép trong nhận ánh vàng | Fade layer 30, liên hệ với độ mở cửa |
| 0,50–2,25 | Ánh sáng chạm vùng mặt nước ngay dưới cửa | Layer 41 fade lên, không phủ sáng toàn ảnh |
| 0,70–3,45 | Mây xuất hiện từ chân cổng rồi tỏa hai bên | Alpha lên chậm, scale nhẹ, drift trái/phải |
| 1,05–4,15 | Dòng sáng lan từ cổng tới cuối ảnh | Mask mềm chạy xuống, giữ nguyên nét sông gốc |
| 1,15–3,20 | Núi gần nhận ánh hắt nhẹ | Layer 50 ở mức thấp, núi xa vẫn mờ |
| 4,15–4,80 | Khóa về end frame | Hòa nhẹ vào ảnh đích sau khi chuyển động chính kết thúc |

Không biến mọi hiệu ứng thành opacity fade cùng lúc. Mối quan hệ cần thấy được là **cửa hé → sáng thoát ra → mây và ánh sáng tới mặt nước → sông sáng dần về phía người xem**.

## 6. Sông sáng lan như thế nào

Giữ nguyên layer ánh sáng sông dạng raster. Chỉ animate mask, không vẽ đường neon mới đè lên artwork.

Phương án trong demo: mask gradient dọc với front chạy từ `y ≈ 1260` đến `y ≈ 2060`. Rìa chuyển tiếp khoảng 200px trên canvas gốc. Đây là cách dựng ổn định, nhẹ và cho cảm giác ánh sáng đi từ xa tới gần. Nó là **reveal theo chiều sâu ảnh**, chưa phải mô phỏng dòng chảy qua từng nhánh.

Nếu muốn theo từng nhánh chính xác hơn: dùng SVG mask có path sông chính và các nhánh, animate `stroke-dashoffset`; nhánh chỉ bắt đầu khi sóng sáng đi tới điểm giao. Mở rộng stroke và feather rìa để reveal texture gốc. `river-reveal-path.svg` chỉ chứa đường chính ước lượng, cần bổ sung nhánh cho bản nâng cao. Không hứa hiệu ứng nhánh chính xác chỉ với gradient dọc.

## 7. Mây và ánh hắt

- Mây chỉ xuất hiện sau khi có khe mở. Gốc phát gần `(540,1317)`.
- Hai lớp mây dịch trái/phải khoảng 64px, đi lên 20–26px trên canvas 1080px. Không đẩy hàng trăm pixel làm mất ngữ cảnh chân cổng.
- Scale nhóm mây tăng từ khoảng `0,76 → 1` ngang, `0,82 → 1` dọc, lấy chân cổng làm tâm.
- Không dùng những vòng tròn blur trắng làm mây, chúng trông như đèn sân khấu.
- Ánh hắt núi nhẹ, ưu tiên bề mặt hướng về cửa và vùng gần. Layer 50 là approximation 2D, không có normal map hay occlusion 3D. Có thể bỏ nếu ưu tiên bám đúng hai artwork.
- Demo hòa toàn cảnh về end frame ở 0,65 giây cuối để xử lý sai khác texture, khói và ánh sáng giữa hai ảnh phẳng. Phần ánh hắt bổ sung cũng hòa về reference ở đoạn này. Nếu muốn duy trì ánh hắt ở trạng thái cuối, đặt layer 50 trên end frame, chấp nhận end frame sẽ khác nhẹ.

## 8. Responsive và vận hành

- Stage gốc `aspect-ratio: 9 / 16`, mọi layer phủ cùng một hệ tọa độ.
- Với toàn màn hình có tỷ lệ khác 9:16, chọn chung `contain` nếu cần thấy trọn trần cổng; nếu `cover`, cần chấp nhận crop và dùng cùng một transform cho toàn bộ stack.
- Nút Open là HTML thật, hỗ trợ bàn phím. Sau click chỉ chạy một timeline, không tạo animation chồng nhau.
- Preload asset trước khi bật nút. Khóa canvas size theo thiết bị nếu cần giảm tải GPU; 1080 × 1920 là master, không bắt buộc là backing buffer trên mọi điện thoại.
- Render bằng `requestAnimationFrame`; dừng ở frame cuối. Chỉ loop mây rất nhẹ nếu thật sự muốn, không loop lại cảnh mở cửa.
- `prefers-reduced-motion`: chuyển thẳng sang end frame hoặc dissolve ngắn; không ép chuyển động dài.
- Nếu dùng React, giữ timer/requestAnimationFrame trong ref và hủy khi unmount. Không `setState` mỗi frame cho tất cả layer.
- Không phụ thuộc CDN trong bản demo. Có thể chuyển timeline sang GSAP nếu dự án đã dùng GSAP.

## 9. Giới hạn và kiểm tra khi ghép vào site

Hai ảnh có texture và chi tiết khác nhẹ, nên không thể có layer vật lý hoàn hảo chỉ bằng tách alpha. Bộ này giữ nền cố định, animate phần cần thiết, rồi khóa end frame. Không nên crossfade cả hai ảnh ngay khi click vì núi và tòa nhà có thể bóng đôi.

Kiểm tra: khe cửa không rò sáng lúc đóng; cửa không trượt đè lên núi; ánh sáng bắt đầu ở chân cổng; không xuất hiện đường nối ngang cứng trên sông; mây có alpha mềm; các công trình xa giữ mờ; trạng thái cuối khớp reference; reset về đúng start; có fallback khi asset tải lỗi.

`demo.html` là bản tham chiếu chuyển động có thể chỉnh, không phải toàn bộ website hoặc hiệu ứng 3D vật lý.

## 10. Kiểm tra đã thực hiện

Đã kiểm tra kích thước/alpha và khả năng đọc của toàn bộ PNG; chạy mã demo bằng native Canvas 2D với DOM shim tại bảy thời điểm; đối chiếu frame cuối trùng runtime reference; kiểm tra reset và reduced-motion. Đây chưa phải kiểm thử trên trình duyệt và điện thoại thực tế. Video preview được render từ chính logic demo ở 12 fps để xem nhịp, không phải tốc độ khung hình giới hạn của animation web.
