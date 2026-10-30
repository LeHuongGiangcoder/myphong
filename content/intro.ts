/**
 * CỔNG BÌNH PHONG — màn mở thiệp dạng tranh be vàng.
 *
 * Bộ asset gốc (master PNG, component web, demo, bản thiết kế .dc.html) nằm ở
 * `brand/garden-intro/`. Chỉ năm ảnh WebP đã nén được chép vào
 * `public/images/intro/` để gửi tới khách.
 *
 * Mọi con số là ĐƠN VỊ THIẾT KẾ, không phải pixel trên màn hình. Bản thiết kế
 * vẽ trên máy 390 × 844; tranh phủ kín khung (cover) nên rộng 475 × 844 và hai
 * bên bị cắt 42,5. Component co cả "sân khấu" 475 × 844 đó theo chiều cao màn
 * hình (xem `--iu` trong components/ui/Garden.tsx), nên chữ, ấn, nút luôn dính
 * đúng vào hoạ tiết ở mọi khổ máy. `x` ở đây đã cộng sẵn 42,5 so với toạ độ
 * trong file thiết kế.
 *
 * Đổi nhịp chuyển động thì sửa file này. Đổi cách dựng cảnh mở Garden.tsx.
 */

export const garden = {
  /** Thư mục ảnh trong public/. */
  dir: "/images/intro",

  /** Sân khấu: khổ tranh sau khi phủ kín một màn 390 × 844. */
  stage: { w: 475, h: 844 },

  images: {
    background: "background.webp",
    sun: "sun-full.webp",
    bamboo: "bamboo.webp",
    ivory: "butterfly-ivory.webp",
    olive: "butterfly-olive.webp",
  },

  /**
   * Mép phải của dải ren, tính bằng % bề ngang tranh. Mặt trời trôi PHÍA SAU
   * dải này: lớp khung cắt từ mép trái tới đây được vẽ lại đè lên mặt trời.
   */
  screenEdge: 60.1,

  /**
   * Mặt trời, tính bằng % khổ tranh. `left` là vị trí lúc ĐÃ mở (khớp bản
   * thiết kế: nửa đĩa lộ ra bên phải dải ren). `hidden` là quãng nó nằm lệch về
   * trái lúc chưa mở — chỉ còn một lưỡi mỏng nhô khỏi dải ren.
   */
  sun: { left: 23, top: 20, width: 62, hidden: 16 },

  /**
   * Tán tre: gốc ở mép trái, lá xoay quanh gốc theo `animate-sway-soft`.
   *
   * `stem` là vùng gốc thân ĐỨNG YÊN (tính bằng % khổ ảnh tre): một hình elip
   * tâm (x, y), bán kính (rx, ry), đặc tới 55% bán kính rồi tan dần. Cùng một
   * ảnh được vẽ hai lần — lớp dưới cả cây lay nhẹ, lớp trên chỉ còn phần gốc
   * đứng yên đè lên — nên không cần tách file. Gốc nằm sát tâm xoay nên dù lớp
   * dưới có lay thì độ lệch ở đó chỉ ~1px, che đi không lộ khe.
   */
  bamboo: { left: -7, top: 19, width: 98, origin: "5% 94%", stem: { x: 6, y: 96, rx: 24, ry: 42 } },

  /**
   * Hai con bướm đậu ở đâu khi dừng (% khổ tranh, góc trên trái của con bướm)
   * và nghiêng bao nhiêu độ. `flap` là chu kỳ đập cánh, tính bằng giây.
   */
  butterflies: {
    ivory: { left: 75, top: 15, width: 10, rotate: -27, flap: 0.46 },
    olive: { left: 67, top: 26, width: 9, rotate: 20, flap: 0.38 },
  },

  /**
   * Nhịp, tính bằng giây từ lúc khách bấm nút.
   *
   * Thứ tự phải đọc ra được: nút lui đi → mặt trời lộ dần từ trái sang phải →
   * bướm từ mép phải bay vào và lượn quanh mặt trời → hero hiện bên dưới →
   * tranh tan đi, còn bướm bay tiếp qua hero rồi mới khuất.
   */
  timings: {
    /** Nút và dòng "chạm để mở" nhường chỗ. */
    cta: [0, 0.45],
    /** Mặt trời trượt ra khỏi dải ren. */
    sun: [0.2, 3.4],
    /** Giây mà hero bắt đầu hiện ra bên dưới tranh. Cùng lúc tranh bắt đầu tan. */
    reveal: 3.9,
    /** Tranh tan trong bao lâu. */
    fade: 0.95,
  },

  /**
   * Đường bay. Mỗi mốc là [giây, dx, dy, độ nghiêng]; dx, dy là độ lệch so với
   * chỗ đậu, tính bằng phần của bề ngang / chiều cao tranh (nên 1 = một khổ
   * tranh). Mốc đầu nằm ngoài mép phải màn hình. Các mốc sát chỗ đậu là lúc
   * bướm lượn quanh mặt trời; sau đó bay ngược sang trái, ngang qua hero.
   *
   * Bướm nghiêng theo hướng bay: ảnh gốc hướng đầu lên trên, nên bay sang trái
   * là nghiêng âm.
   */
  flight: {
    ivory: [
      [0.9, 0.58, 0.22, -75],
      [1.7, 0.34, 0.12, -62],
      [2.4, 0.16, 0.19, -20],
      [3.0, 0.05, 0.02, -40],
      [3.6, 0, 0, -27],
      [4.3, -0.03, -0.015, -24],
      [5.2, -0.28, -0.07, -70],
      [6.1, -0.55, 0.03, -95],
      [7.0, -0.95, -0.1, -80],
      [7.8, -1.4, -0.06, -85],
    ],
    olive: [
      [1.3, 0.62, -0.1, -80],
      [2.1, 0.4, 0, -50],
      [2.8, 0.18, 0.12, 10],
      [3.4, 0.06, 0.03, 30],
      [4.0, 0, 0, 20],
      [4.8, 0.02, -0.02, 26],
      [5.6, -0.22, 0.12, -60],
      [6.5, -0.55, 0.24, -100],
      [7.4, -0.95, 0.14, -85],
      [8.2, -1.45, 0.26, -90],
    ],
  },

  /**
   * Chữ và ấn đặt trên tranh (đơn vị thiết kế; `size` là cỡ chữ, `ls` là giãn
   * chữ tính theo em). Vị trí khớp bản `brand/garden-intro/.../Intro.dc.html`.
   */
  layout: {
    /** Vạch đứng và dòng chữ dọc ở dải nâu bên trái. */
    rule: { x: 107.5, y: 470, h: 136 },
    vertical: { x: 102.5, y: 818, size: 10, ls: 0.3 },
    /** Ấn 囍 trên dải ren; `ring` là viền kem quanh ấn. */
    seal: { x: 187.5, y: 548, size: 58, glyph: 36, ring: 4 },
    cta: { x: 152.5, y: 722, w: 128, h: 56, size: 12.5, ls: 0.3 },
    tap: { x: 147.5, y: 790, w: 138, size: 15 },
    /** Khối tên hai người + lời mời, cột phải trên nền giấy. */
    names: {
      x: 300.5,
      y: 500,
      w: 134,
      label: { size: 11, ls: 0.22 },
      name: { size: 33, amp: 26 },
      rule: { w: 48, gap: 20 },
      invite: { gap: 18, size: 27 },
      /** Khoảng cách: nhãn → tên, và nhãn "Thân mời" → người nhận */
      gap: { label: 10, guest: 6 },
    },
  },
} as const;

/** Một đơn vị thiết kế → CSS. `--iu` do Garden.tsx đặt: 1 đơn vị = chiều cao màn hình / 844. */
export const du = (n: number) => `calc(${n} * var(--iu))`;

/**
 * Bề ngang còn lại từ mép trái của cột x tới mép phải MÀN HÌNH (chừa 14px).
 * Sân khấu đứng giữa màn hình nên mép trái của x nằm ở
 * `50vw + (x − stage.w / 2) · iu`. Máy càng cao hẹp (Samsung 20:9 trở lên) thì
 * hai bên bị cắt càng nhiều và quãng này càng ngắn.
 */
export const roomRight = (x: number) =>
  `calc(50vw - ${x - garden.stage.w / 2} * var(--iu) - 14px)`;

/**
 * Cỡ chữ `units` (đơn vị thiết kế) nhưng không để dòng chữ rộng `em` lần cỡ
 * chữ tràn quá mép phải màn hình.
 */
export const fitText = (units: number, x: number, em: number) =>
  `min(${du(units)}, calc(${roomRight(x)} / ${em}))`;
