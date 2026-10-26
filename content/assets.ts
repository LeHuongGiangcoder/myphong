/**
 * TỰ SINH — đừng sửa tay. Chạy `npm run assets` để dựng lại.
 *
 * Bản kê những gì đang có trong brand/. Nguồn thật nằm ở brand/, bản chép để
 * phục vụ nằm ở public/brand/. Gắn asset vào section ở `design` trong
 * content/client.ts; TypeScript sẽ bắt lỗi nếu gõ sai tên.
 */

export const assets = {
  /** Vân giấy / hoạ tiết lặp, trải kín nền section */
  textures: {},

  /** Ảnh nền full-bleed của một section */
  backgrounds: {
    "paper-cream": { src: "/brand/backgrounds/paper-cream.webp", width: 1080, height: 1920 },
  },

  /** Hoạ tiết rời (hoa, ruy băng, con dấu) — nền trong suốt */
  elements: {
    "agenda": { src: "/brand/elements/agenda.webp", width: 1080, height: 1920 },
    "dresscode": { src: "/brand/elements/dresscode.webp", width: 1080, height: 2300 },
    "rsvp-bloom-left": { src: "/brand/elements/rsvp-bloom-left.webp", width: 520, height: 829 },
    "rsvp-bloom-right": { src: "/brand/elements/rsvp-bloom-right.webp", width: 520, height: 1128 },
    "rsvp-card-bottom": { src: "/brand/elements/rsvp-card-bottom.webp", width: 1080, height: 799 },
    "rsvp-card-mid": { src: "/brand/elements/rsvp-card-mid.webp", width: 1080, height: 20 },
    "rsvp-card-top": { src: "/brand/elements/rsvp-card-top.webp", width: 1080, height: 1101 },
    "rsvp": { src: "/brand/elements/rsvp.webp", width: 1080, height: 1920 },
    "sun": { src: "/brand/elements/sun.webp", width: 174, height: 164 },
    "timevenue": { src: "/brand/elements/timevenue.webp", width: 1080, height: 1920 },
  },

  /** Dải ngăn giữa hai section, lặp theo chiều ngang */
  dividers: {},
} as const;

export type TextureName = keyof typeof assets.textures;
export type BackgroundName = keyof typeof assets.backgrounds;
export type ElementName = keyof typeof assets.elements;
export type DividerName = keyof typeof assets.dividers;
