/**
 * Đổi màu GIẤY nền của các tranh đã dựng sẵn giấy kem (thiệp RSVP) sang
 * màu nền của tông `garden`, để section đổi nền mà tranh không lộ hình chữ nhật.
 *
 *   brand/paper-cream-originals/*.webp  →  brand/elements/*.webp
 *
 * Chạy: node scripts/recolor-paper.mjs [màu giấy mới, mặc định #ede6d6]
 * Rồi: npm run assets (chép brand/ sang public/brand/)
 *
 * Luôn đọc từ bản gốc nên chạy lại bao nhiêu lần cũng không bị nhân màu. Muốn
 * trả về giấy cũ thì chép bản gốc đè lại brand/elements/.
 *
 * Cách đổi: màu giấy của tranh (đo bằng trung vị các điểm sáng) được "thắp
 * lại" thành màu mới bằng cách nhân từng kênh với tỉ lệ mới/cũ — nét vẽ giữ
 * nguyên quan hệ sáng tối, chỉ cả tranh ấm hơn một chút. Ô giấy của thiệp RSVP
 * được GIỮ NGUYÊN màu kem sáng để nó vẫn đọc ra là một tấm thiệp đặt trên nền.
 *
 * Hoạ tiết nhỏ (sparkle, hoa đỏ, mây nhỏ) của thiệp RSVP được tách thành sprite
 * trong suốt (`brand/elements/sparkle-*.webp`, `flower-red-*`, `cloud-small.webp`) và
 * gỡ khỏi tấm thiệp ở những chỗ cần — xem ORNAMENTS.
 *
 * Riêng thiệp RSVP: hai chiếc đèn lồng hồng ở hai góc trên được đổi thành
 * trắng ngà. Chỉ những điểm vừa hồng vừa không-vàng mới bị đổi (nên nét viền,
 * hoa vàng và nắp đèn giữ nguyên), độ sáng tối của thân đèn được giữ để còn
 * thấy nếp giấy.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const FROM = path.join(ROOT, "brand", "paper-cream-originals");
const TO = path.join(ROOT, "brand", "elements");

const hex = (process.argv[2] ?? "#ede6d6").replace("#", "");
const TARGET = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Ô giấy của thiệp RSVP (px trong ảnh 1080 rộng) — không đổi màu trong ô này. */
const CARD = { x0: 188, x1: 885 };
const FILES = {
  "rsvp-card-top.webp": { card: { ...CARD, y0: 512, y1: Infinity }, lanterns: true },
  "rsvp-card-mid.webp": { card: { ...CARD, y0: 0, y1: Infinity } },
  "rsvp-card-bottom.webp": { card: { ...CARD, y0: 0, y1: 455 } },
};

/** Hai đèn lồng ở góc trên của lát trên: [x0, y0, x1, y1]. */
const LANTERNS = [
  [0, 100, 178, 350],
  [922, 70, 1080, 372],
];
const IVORY = [252, 246, 234];

/**
 * Hoạ tiết nhỏ trên thiệp RSVP: tách thành sprite trong suốt (để đặt lại chỗ
 * khác hoặc nhân sang section khác) và/hoặc xoá khỏi tấm thiệp. `box` là
 * [x0, y0, x1, y1] trong ảnh 1080 rộng.
 *
 *   mode "line"   nét mảnh một màu (sparkle, viền mây): màu mực lấy từ điểm đậm
 *                 nhất, độ trong suốt tính theo độ lệch so với giấy — nên nét
 *                 mảnh không bị viền giấy.
 *   mode "paint"  hoa nhiều sắc: giữ nguyên màu, chỉ gỡ viền giấy ở mép.
 *   erase         true = xoá khỏi tấm thiệp (tô lại bằng giấy, có hạt nhẹ).
 */
const ORNAMENTS = {
  "rsvp-card-top.webp": {
    sprites: [
      { name: "sparkle-red", box: [772, 50, 892, 166], mode: "line", erase: true },
      { name: "sparkle-gold", box: [918, 522, 972, 574], mode: "line", erase: true },
      { name: "flower-red-left", box: [0, 788, 58, 854], mode: "paint", erase: true },
      { name: "flower-red-right", box: [1008, 884, 1080, 1000], mode: "paint", erase: true },
    ],
    /** Chỉ xoá (đã có sprite cùng kiểu ở trên) — sparkle thứ hai, và bông hoa viền bên trái. */
    erase: [
      [36, 988, 138, 1095],
      [978, 980, 1030, 1030],
      [133, 298, 181, 343],
      // Dải mây vàng lớn ở góc trên trái: ba hình chữ nhật chừa đèn lồng ra
      // (đèn chiếm x < 172 từ y 140; nắp đèn x < 108 từ y 108).
      [108, 0, 590, 140],
      // Phần dải mây vòng ra phía trên đèn: hai bên dây treo (x 52–62) và vòng (x 35–80) giữ nguyên.
      [0, 0, 34, 106],
      [84, 0, 108, 106],
      // Hai nét mây cắt ngang dây treo: mép tan 1px để không ăn vào dây.
      [34, 0, 52, 60, 1],
      [64, 0, 84, 60, 1],
      [152, 136, 178, 153, 1],
      [172, 140, 590, 255],
      // Cành hoa trắng bên phải tấm giấy (bắt đầu sau viền giấy ở x ≈ 884) và cánh hoa rơi dưới nó.
      [886, 572, 1040, 955],
    ],
  },
  "rsvp-card-bottom.webp": {
    sprites: [
      { name: "cloud-small", box: [888, 0, 1080, 164], mode: "line", erase: false },
    ],
  },
};

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lum = (r, g, b) => (0.3 * r + 0.59 * g + 0.11 * b) / 255;

/** Trọng số "là thân đèn hồng": r vượt g xa, và b không thấp hơn g quá ~20 (vàng và nâu có b thấp hơn g 27–47). */
function pinkWeight(r, g, b) {
  return clamp((r - g - 30) / 40) * clamp((b - g + 26) / 14);
}

const smooth = (lo, hi, v) => {
  const t = clamp((v - lo) / (hi - lo));
  return t * t * (3 - 2 * t);
};

/** Tách một vùng thành sprite RGBA trong suốt, so với màu giấy `paper`. */
function extractSprite(buf, W, [x0, y0, x1, y1], mode, paper) {
  const w = x1 - x0, h = y1 - y0;
  const diff = new Float32Array(w * h);
  let dmax = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = ((y0 + y) * W + (x0 + x)) * 3;
      const d = Math.max(Math.abs(buf[i] - paper[0]), Math.abs(buf[i + 1] - paper[1]), Math.abs(buf[i + 2] - paper[2]));
      diff[y * w + x] = d;
      if (d > dmax) dmax = d;
    }

  // Màu mực của nét mảnh: trung bình các điểm đậm nhất.
  let ink = [0, 0, 0], inkD = 1;
  if (mode === "line") {
    let n = 0;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (diff[y * w + x] >= dmax * 0.75) {
          const i = ((y0 + y) * W + (x0 + x)) * 3;
          ink[0] += buf[i]; ink[1] += buf[i + 1]; ink[2] += buf[i + 2]; n++;
        }
    ink = ink.map((v) => v / n);
    inkD = Math.max(Math.abs(ink[0] - paper[0]), Math.abs(ink[1] - paper[1]), Math.abs(ink[2] - paper[2]));
  }

  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = diff[y * w + x];
      const i = ((y0 + y) * W + (x0 + x)) * 3;
      const o = (y * w + x) * 4;
      let a, c;
      if (mode === "line") {
        a = d < 9 ? 0 : clamp(d / inkD);
        c = ink;
      } else {
        a = smooth(12, 40, d);
        c = a > 0 ? [0, 1, 2].map((k) => clamp((buf[i + k] - paper[k] * (1 - a)) / a, 0, 255)) : [0, 0, 0];
      }
      rgba[o] = c[0]; rgba[o + 1] = c[1]; rgba[o + 2] = c[2]; rgba[o + 3] = Math.round(a * 255);
    }
  return { rgba, w, h };
}

/** Tô một vùng bằng màu giấy lấy ở viền quanh nó + hạt nhẹ, mép tan dần 6px. */
function erase(buf, W, H, [x0, y0, x1, y1, m = 6], paper) {
  const bx0 = Math.max(0, x0 - m), by0 = Math.max(0, y0 - m);
  const bx1 = Math.min(W, x1 + m), by1 = Math.min(H, y1 + m);
  const ring = [[], [], []];
  for (let y = Math.max(0, by0 - 3); y < Math.min(H, by1 + 3); y++)
    for (let x = Math.max(0, bx0 - 3); x < Math.min(W, bx1 + 3); x++) {
      if (x >= bx0 && x < bx1 && y >= by0 && y < by1) continue;
      const i = (y * W + x) * 3;
      if (Math.max(Math.abs(buf[i] - paper[0]), Math.abs(buf[i + 1] - paper[1]), Math.abs(buf[i + 2] - paper[2])) < 10)
        for (let k = 0; k < 3; k++) ring[k].push(buf[i + k]);
    }
  const base = ring.map((r, k) => (r.length ? median(r) : paper[k]));
  let seed = 12345;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5) * 5;
  for (let y = by0; y < by1; y++)
    for (let x = bx0; x < bx1; x++) {
      // Cạnh nằm sát mép ảnh thì không tan dần: ngoài mép không còn gì để hoà vào.
      const edge = Math.min(
        bx0 === 0 ? Infinity : x - bx0,
        bx1 === W ? Infinity : bx1 - 1 - x,
        by0 === 0 ? Infinity : y - by0,
        by1 === H ? Infinity : by1 - 1 - y,
      );
      const wgt = Math.min(1, (edge + 1) / m);
      const i = (y * W + x) * 3;
      const n = rnd();
      for (let k = 0; k < 3; k++) buf[i + k] = Math.round(clamp(buf[i + k] * (1 - wgt) + (base[k] + n) * wgt, 0, 255));
    }
}

function median(values) {
  values.sort((a, b) => a - b);
  return values[values.length >> 1];
}

for (const [name, opts] of Object.entries(FILES)) {
  const { data, info } = await sharp(path.join(FROM, name))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const at = (x, y) => (y * W + x) * 3;

  const inCard = (x, y) =>
    opts.card && x >= opts.card.x0 && x <= opts.card.x1 && y >= opts.card.y0 && y <= opts.card.y1;

  // Màu giấy: trung vị các điểm rất sáng NGOÀI ô thiệp.
  const rs = [], gs = [], bs = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (inCard(x, y)) continue;
      const i = at(x, y);
      if (Math.min(data[i], data[i + 1], data[i + 2]) >= 232) {
        rs.push(data[i]); gs.push(data[i + 1]); bs.push(data[i + 2]);
      }
    }
  }
  const paper = [median(rs), median(gs), median(bs)];
  const k = TARGET.map((t, c) => t / paper[c]);

  // Độ sáng trung bình của thân đèn, để giữ nếp sáng tối khi đổi sang trắng.
  let lref = 0.6;
  if (opts.lanterns) {
    let sum = 0, n = 0;
    for (const [x0, y0, x1, y1] of LANTERNS)
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = at(x, y);
          if (pinkWeight(data[i], data[i + 1], data[i + 2]) > 0.9) {
            sum += lum(data[i], data[i + 1], data[i + 2]);
            n++;
          }
        }
    if (n) lref = sum / n;
  }

  const out = Buffer.from(data);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (inCard(x, y)) continue;
      const i = at(x, y);
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let nr = Math.min(255, r * k[0]);
      let ng = Math.min(255, g * k[1]);
      let nb = Math.min(255, b * k[2]);

      if (opts.lanterns && LANTERNS.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1)) {
        const w = clamp(pinkWeight(r, g, b) * 1.5);
        if (w > 0) {
          const shade = clamp(0.6 + 0.4 * (lum(r, g, b) / lref), 0.4, 1);
          nr = nr * (1 - w) + IVORY[0] * shade * w;
          ng = ng * (1 - w) + IVORY[1] * shade * w;
          nb = nb * (1 - w) + IVORY[2] * shade * w;
        }
      }
      out[i] = Math.round(clamp(nr, 0, 255));
      out[i + 1] = Math.round(clamp(ng, 0, 255));
      out[i + 2] = Math.round(clamp(nb, 0, 255));
    }
  }

  const orn = ORNAMENTS[name];
  if (orn) {
    // Tách sprite từ ảnh ĐÃ đổi giấy (viền giấy khớp màu nền), rồi mới xoá.
    for (const sp of orn.sprites) {
      const { rgba, w, h } = extractSprite(out, W, sp.box, sp.mode, TARGET);
      await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
        .webp({ lossless: true })
        .toFile(path.join(TO, `${sp.name}.webp`));
      console.log(`  sprite ${sp.name} ${w}×${h}`);
    }
    for (const sp of orn.sprites) if (sp.erase) erase(out, W, H, sp.box, TARGET);
    for (const box of orn.erase ?? []) erase(out, W, H, box, TARGET);
  }

  await mkdir(TO, { recursive: true });
  await sharp(out, { raw: { width: W, height: H, channels: 3 } })
    .webp({ quality: 95, effort: 5 })
    .toFile(path.join(TO, name));
  console.log(`${name}: giấy ${paper.join(",")} → ${TARGET.join(",")}`);
}
