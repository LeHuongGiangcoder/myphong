/**
 * CỔNG HUẾ — cảnh mở cửa của màn mở thiệp.
 *
 * Bộ asset gốc nằm ở `brand/hue-gateway-intro/` (guide, bản master PNG, video
 * tham chiếu, demo.html). Chỉ các layer đã nén sang WebP được chép vào
 * `public/images/gateway/` để gửi tới khách — bộ master KHÔNG nằm trong
 * public, nên khách không phải tải 5MB PNG.
 *
 * Mọi con số dưới đây lấy nguyên từ `manifest.json` của bộ asset. Chúng là
 * toạ độ BÊN TRONG bức tranh 1080 × 1920, không phải pixel trên màn hình —
 * `components/ui/Gateway.tsx` vẽ toàn bộ cảnh vào một canvas 1080 × 1920 rồi
 * mới co cả canvas đó cho vừa màn hình, nên một hệ toạ độ duy nhất dùng được
 * cho mọi khổ máy.
 *
 * Đổi nhịp chuyển động thì sửa file này. Đổi cách vẽ mới phải mở Gateway.tsx.
 */

export const gateway = {
  /** Thư mục layer trong public/. */
  dir: "/images/gateway",

  /** Khổ gốc của tranh. Mọi toạ độ bên dưới tính theo hệ này. */
  canvas: { w: 1080, h: 1920 },

  /**
   * Ô cửa — vùng duy nhất mà hai cánh cửa được phép trượt qua. Cắt đúng ô này
   * thì cánh cửa khuất sau hai trụ cố định thay vì trượt đè lên núi.
   */
  aperture: { x: 457, y: 343, w: 167, h: 974 },

  /** Hai cánh hẹp tách từ đường giữa (x = 540) ra hai bên, tính bằng px. */
  door: { left: 83, right: 84, seam: 540 },

  /** Chân cổng — nơi mây bắt đầu toả ra và dòng sáng bắt đầu chảy. */
  threshold: { x: 540, y: 1316 },

  /** Tổng thời gian của chuỗi mở cửa, tính bằng giây. */
  duration: 4.8,

  /**
   * Mỗi hiệu ứng một cặp [bắt đầu, kết thúc] tính bằng giây.
   *
   * Thứ tự phải đọc ra được: cửa hé → sáng thoát ra → mây và ánh sáng chạm
   * mặt nước → sông sáng dần về phía người xem. Đừng cho tất cả fade cùng lúc.
   */
  timings: {
    /** Hai cánh tách ra. Ease in-out cubic, không nảy. */
    doors: [0.25, 2.75],
    /** Trần và mép trong cổng nhận ánh vàng. */
    frame: [0.28, 2.55],
    /** Ánh sáng hắt xuống mặt nước ngay dưới cửa. */
    spill: [0.5, 2.25],
    /** Mây hiện ra ở chân cổng rồi trôi sang hai bên. */
    fog: [0.7, 3.45],
    /** Mây đạt độ đậm tối đa (nằm trong khoảng `fog`). */
    fogFade: [0.7, 1.75],
    /** Dòng sáng lan từ cổng xuống tiền cảnh. */
    river: [1.05, 4.15],
    /** Ánh vàng phản nhẹ lên núi gần. */
    bounce: [1.15, 3.2],
    /** Hoà về đúng end frame, xử lý sai khác texture giữa hai bức tranh gốc. */
    settle: [4.15, 4.8],
  },

  /** Độ đậm tối đa của từng lớp ánh sáng. Giữ thấp — đây là ánh sáng, không phải đèn pha. */
  intensity: { spill: 0.35, bounce: 0.65, fog: 0.72 },

  /**
   * Dòng sáng trên sông: giữ nguyên texture gốc, chỉ chạy một mask mềm theo
   * chiều sâu ảnh. `from` → `to` là vị trí của mép sáng, `feather` là độ nhoè
   * của mép đó — mép cứng sẽ thành một đường nối ngang rất lộ.
   */
  river: { from: 1260, to: 2060, feather: [110, 90] },

  /**
   * Mây: toả ra từ chân cổng, dịch sang hai bên vài chục px thôi. Đẩy hàng
   * trăm px là mất ngữ cảnh chân cổng.
   */
  fog: { drift: 64, rise: [20, 26], scale: { from: [0.76, 0.82], to: [1, 1] } },

  /**
   * Đoạn nối sang hero: "bước qua cửa". Cảnh phóng dần về phía ô cửa, ánh
   * vàng trong cửa trào ra phủ khung hình, hero hiện lên bên dưới rồi lớp cổng
   * tan đi. Hai ảnh chồng nhau một nhịp nên mắt không thấy cú cắt.
   *
   * Mốc thời gian tính từ lúc khách bấm nút, cùng hệ với `timings`.
   */
  handoff: {
    /** Bắt đầu đẩy tới cửa — chồng lên đoạn settle cuối nên không có nhịp chết. */
    start: 4.2,
    /** Phóng tới mức này, lấy tâm ô cửa làm gốc. */
    zoom: 1.35,
    /** Thời gian của cú đẩy. */
    push: 1.6,
    /** Đỉnh của quầng sáng trào ra từ ô cửa. Giữ dưới 0.6, không loé trắng. */
    glow: 0.52,
    /** Giây mà hero bắt đầu hiện ra bên dưới lớp cổng. */
    reveal: 5.05,
    /** Lớp cổng tan trong bao lâu, bắt đầu cùng lúc với `reveal`. */
    fade: 0.85,
  },

  /**
   * Thứ tự xếp lớp đã nằm sẵn trong code vẽ. Ở đây chỉ khai tên file.
   *
   * Lưu ý hai cặp loại trừ nhau trong bộ asset gốc: dùng `30-portal-frame-open`
   * HOẶC `31-portal-light` (không cộng cả hai, sẽ sáng quá), và dùng hai lớp
   * mây trái/phải HOẶC `60-fog-bank` nguyên dải.
   */
  layers: {
    base: "00-base-closed.webp",
    interior: "10-portal-interior.webp",
    left: "20-door-left-crop.webp",
    right: "21-door-right-crop.webp",
    frame: "30-portal-frame-open.webp",
    river: "40-river-light.webp",
    spill: "41-threshold-spill.webp",
    bounce: "50-mountain-bounce-optional.webp",
    fogLeft: "61-fog-left.webp",
    fogRight: "61-fog-right.webp",
    end: "99-reference-open.webp",
  },
} as const;

export type Gateway = typeof gateway;
