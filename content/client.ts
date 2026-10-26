import type { BackgroundName, DividerName, ElementName, TextureName } from "@/content/assets";
import type { L } from "@/content/i18n";
import type { Tone } from "@/content/theme";

/**
 * NỘI DUNG CỦA KHÁCH — làm site mới thì sửa duy nhất file này (và theme.ts,
 * public/images, public/audio). Không cần mở components.
 *
 * ⚠️ Toàn bộ giá trị dưới đây là PLACEHOLDER. Trước khi gửi khách phải thay
 * hết: tên, ngày giờ, địa chỉ, link Maps, ảnh, nhạc, RSVP endpoint.
 *
 * SONG NGỮ: site này có nút chuyển VI / EN. Mọi câu chữ là một cặp
 * `{ vi: "…", en: "…" }` — xem content/i18n.ts. Thứ không dịch (tên người,
 * ngày `20 . 12 . 2026`, giờ `17:30`, mã màu, hashtag) vẫn là chuỗi thường.
 *
 * Ngày giờ luôn viết dạng ISO kèm offset Việt Nam (+07:00) để lịch và đồng hồ
 * đếm ngược không lệch múi giờ.
 */

/* --------------------------------------------------------------- SECTIONS */

/** Mọi section có trong khung nền. */
export type SectionId =
  | "intro"
  | "hero"
  | "loveStory"
  | "gallery"
  | "weddingInfo"
  | "agenda"
  | "dresscode"
  | "rsvp"
  | "thankYou";

/**
 * Thứ tự hiển thị. Bỏ một section khỏi mảng này là nó không render nữa —
 * không cần xoá code. Đổi chỗ hai dòng là đổi thứ tự trên trang.
 *
 * `intro` là màn mở thiệp, luôn nằm ngoài luồng cuộn; để nó trong mảng thì
 * có cổng mở thiệp, bỏ ra thì trang mở thẳng vào hero.
 *
 * Site này chạy bảy section. `loveStory` và `gallery` vẫn còn code trong
 * components/sections — thêm tên vào mảng là chúng hiện lại.
 */
export const sections: SectionId[] = [
  "intro",
  "hero",
  "weddingInfo",
  "agenda",
  "dresscode",
  "rsvp",
  "thankYou",
];

/* ----------------------------------------------------------- MẶT NHÌN */

/**
 * Một hoạ tiết rời đặt lên nền section.
 *
 * `at` là chuỗi utility Tailwind định vị + bề rộng, ví dụ
 * `"top-[6%] -left-[4%] w-[28%]"`. Dùng % thay vì rem để hoạ tiết co theo
 * section trên điện thoại; `hideOnMobile` cho những cái màn hẹp không còn chỗ.
 */
export type DecorPlacement = {
  name: ElementName;
  at: string;
  rotate?: number;
  /**
   * Chỉ đặt khi người dùng yêu cầu. Mặc định 1 — xem "Ba luật thiết kế" trong
   * CLAUDE.md: không làm mờ hoạ tiết cho chìm vào nền.
   */
  opacity?: number;
  /** Lắc lư nhẹ, cho thứ trông như đang treo hoặc rung rinh. */
  sway?: boolean;
  /** Trôi chậm hơn trang bao nhiêu % khi cuộn. */
  parallax?: number;
  hideOnMobile?: boolean;
  /**
   * Hoạ tiết này chiếm bao nhiêu bề ngang màn hình, cho trình duyệt chọn đúng
   * cỡ file. Mặc định hợp với hoạ tiết nhỏ ở góc; hoạ tiết trải hết bề ngang
   * (dải khung, băng mực) phải đặt `"100vw"`, nếu không trình duyệt tải bản
   * 40vw rồi kéo giãn ra và hoạ tiết bị mờ.
   */
  sizes?: string;
};

export type SectionDesign = {
  /** id trong HTML — cũng là cái dùng cho link neo `#...`. */
  anchor: string;
  /** Bảng màu, xem `tones` trong content/theme.ts. */
  tone: Tone;
  /**
   * Ảnh nền full-bleed. Nhận hai kiểu:
   *   • tên trong `assets.backgrounds` — ảnh của design system, ở brand/
   *   • đường dẫn bắt đầu bằng "/" — ảnh của chính cặp đôi, ở public/images
   * null = chỉ dùng màu nền của tông.
   */
  background?: BackgroundName | `/${string}` | null;
  /** Độ mờ của lớp phủ trên ảnh nền, 0–1. Cao hơn = chữ dễ đọc hơn. */
  overlay?: number;
  /** Vân giấy lặp kín nền. */
  texture?: TextureName | null;
  /** Dải ngăn cưỡi lên đường nối với section phía trên. */
  divider?: DividerName | null;
  decor?: DecorPlacement[];
  /**
   * CHỈ cho section `intro`. Bật cảnh cổng Huế động thay cho nền tĩnh: khách
   * bấm mở thiệp thì cửa tách ra, ánh sáng và mây tràn ra, rồi cảnh đẩy qua
   * cửa sang hero. Nhịp và toạ độ nằm ở content/gateway.ts.
   *
   * Tắt (hoặc thiếu layer) thì màn mở thiệp quay về ảnh `background` ở dưới.
   */
  gateway?: boolean;
};

/**
 * Mặt nhìn của từng section — tông màu, nền, hoạ tiết.
 *
 * Tách khỏi file section để đổi diện mạo là sửa nội dung chứ không sửa code.
 * Tên asset lấy từ `content/assets.ts`, file đó do `npm run assets` sinh ra
 * sau khi bạn thả file vào `brand/`. Gõ sai tên là TypeScript báo đỏ ngay.
 *
 * Khung nền để trống hết phần nền — site chạy bằng màu phẳng của theme cho
 * tới khi khách gửi design system.
 */
export const design: Record<SectionId, SectionDesign> = {
  /* `background` ở đây là bản dự phòng: chỉ hiện nếu cảnh cổng tải lỗi. */
  intro: {
    anchor: "intro",
    tone: "dark",
    gateway: true,
    background: "/images/intro.jpg",
    overlay: 0.55,
  },
  hero: { anchor: "hero", tone: "dark", background: "/images/hero-plate.jpg", overlay: 0 },
  loveStory: { anchor: "love-story", tone: "paper" },
  gallery: { anchor: "gallery", tone: "light" },
  /*
    Tranh mực của khách dùng NGUYÊN BẢN — ghép sẵn element lên vân giấy thành
    một ảnh 9:16, không tách mảnh: bố cục dải mực là một mạch liền.

    Tranh neo ở mép trên và giữ đúng khổ 9:16, nên khoảng giấy trống của nó
    luôn rơi vào cùng một chỗ ở mọi khổ máy. Chỉ chữ ĐẦU section nằm trong
    khoảng đó; phần còn lại chảy xuống dưới bức tranh, trên nền giấy trơn —
    vùng trống của tranh chỉ cao bằng một nửa bức tranh, không chứa nổi cả
    section ở khổ điện thoại. Xem components/sections/WeddingInfo.tsx.
  */
  weddingInfo: {
    anchor: "wedding-info",
    tone: "light",
    background: "paper-cream",
    overlay: 0,
    decor: [
      {
        name: "timevenue",
        at: "inset-x-0 top-0 mx-auto w-full max-w-stage",
        sizes: "(max-width: 32rem) 100vw, 32rem",
      },
    ],
  },
  /*
    Dải sen của khách, dùng nguyên bản trong một khung 9:16. Chữ của section
    nằm trong năm ô giấy trống so le hai bên dải sen — toạ độ đo bằng tương
    phản, xem components/sections/Agenda.tsx.
  */
  agenda: {
    anchor: "agenda",
    tone: "light",
    /* Cùng vân giấy đã ghép vào bức tranh, trải cho cả section — nếu không,
       chỗ tranh kết thúc sẽ lộ một đường nối giữa giấy (#fdf8f1) và màu kem
       của theme (#f7eedc). */
    background: "paper-cream",
    overlay: 0,
    decor: [
      {
        name: "agenda",
        at: "inset-x-0 top-0 mx-auto w-full max-w-stage",
        sizes: "(max-width: 32rem) 100vw, 32rem",
      },
    ],
  },
  /* Tranh tre + núi của khách, nguyên bản trong khung 9:16. Chữ nằm ở phần
     trên; dãy núi ở chân tranh để trống. Xem components/sections/Dresscode.tsx. */
  dresscode: {
    anchor: "dresscode",
    tone: "light",
    /* Cùng vân giấy đã ghép vào bức tranh, trải cho cả section — nếu không,
       chỗ tranh kết thúc sẽ lộ một đường nối giữa giấy (#fdf8f1) và màu kem
       của theme (#f7eedc). */
    background: "paper-cream",
    overlay: 0,
    decor: [
      {
        name: "dresscode",
        at: "inset-x-0 top-0 mx-auto w-full max-w-stage",
        sizes: "(max-width: 32rem) 100vw, 32rem",
      },
    ],
  },
  /* Tấm thiệp có khung của khách, nguyên bản trong khung 9:16. Phần đầu
     R.S.V.P nằm trong ô giấy giữa tranh, form ở dưới. Xem Rsvp.tsx. */
  rsvp: {
    anchor: "rsvp",
    tone: "light",
    /* Cùng vân giấy đã ghép vào bức tranh, trải cho cả section — nếu không,
       chỗ tranh kết thúc sẽ lộ một đường nối giữa giấy (#fdf8f1) và màu kem
       của theme (#f7eedc). */
    background: "paper-cream",
    overlay: 0,
    decor: [
      {
        name: "rsvp",
        at: "inset-x-0 top-0 mx-auto w-full max-w-stage",
        sizes: "(max-width: 32rem) 100vw, 32rem",
      },
    ],
  },
  thankYou: { anchor: "thank-you", tone: "dark" },
};

/* ------------------------------------------------------------------ COUPLE */

/** Tên người không dịch — cùng một chuỗi ở cả hai thứ tiếng. */
export const couple = {
  /** Tên hiển thị lớn ở hero và màn mở thiệp */
  groom: "Phong",
  bride: "My",
  /** Tên đầy đủ, dùng trong phần thông tin lễ cưới */
  groomFull: "Hoa Quốc Phong",
  brideFull: "Bùi Huyền My",
  hashtag: "#PhongCuoiMy",
};

/** Bố mẹ hai bên — hiện ở section Time & Venue */
export const families: {
  side: L;
  people: { role: L; name: string }[];
  home: string;
}[] = [
  {
    side: { vi: "Nhà trai", en: "Groom's family" },
    people: [
      { role: { vi: "Ông", en: "Mr." }, name: "Họ Tên Bố Chú Rể" },
      { role: { vi: "Bà", en: "Mrs." }, name: "Họ Tên Mẹ Chú Rể" },
    ],
    home: "Địa chỉ nhà trai",
  },
  {
    side: { vi: "Nhà gái", en: "Bride's family" },
    people: [
      { role: { vi: "Ông", en: "Mr." }, name: "Họ Tên Bố Cô Dâu" },
      { role: { vi: "Bà", en: "Mrs." }, name: "Họ Tên Mẹ Cô Dâu" },
    ],
    home: "Địa chỉ nhà gái",
  },
];

/* -------------------------------------------------------------- NGÀY & GIỜ */

export const ceremony = {
  /** Giờ khai tiệc. Lịch, đồng hồ đếm ngược và link Google Calendar đều tính từ đây. */
  startISO: "2027-12-11T17:30:00+07:00",
  /** Giờ tan tiệc — chỉ dùng cho link thêm vào lịch. */
  endISO: "2027-12-11T21:30:00+07:00",
  weekday: { vi: "Thứ Bảy", en: "Saturday" },
  dateShort: "11 . 12 . 2027",
  timeLabel: "17:30",
  /** Ngày âm — gia đình tự đọc, không tính tự động. */
  lunar: {
    vi: "Tức ngày 02 tháng 11 năm Bính Ngọ",
    en: "The 2nd day of the 11th lunar month, Year of the Fire Horse",
  },
};

export const venue = {
  name: "Fairmont Hanoi",
  hall: { vi: "Tên sảnh — Tầng X", en: "Hall name — Floor X" },
  address: "Số nhà, đường, phường, quận, thành phố",
  /** Link Maps của khách. Nên dùng link chia sẻ ghim sẵn, đừng để ?query= tự tìm. */
  mapUrl: "https://www.google.com/maps",
  mapLabel: { vi: "Xem bản đồ", en: "Open in Maps" },
  note: {
    vi: "Kính mời quý khách tới sớm ít phút để kịp chụp hình cùng gia đình.",
    en: "Please arrive a few minutes early so we can take photos together.",
  },
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  eyebrow: { vi: "Save the Date", en: "Save the Date" },
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: { vi: "Mở thiệp", en: "Open invitation" },
  note: { vi: "Trân trọng kính mời", en: "You are warmly invited" },
  /**
   * Chỉ trình đọc màn hình nghe thấy: báo trước rằng bấm nút sẽ chạy một cảnh
   * mở cổng vài giây chứ không vào thiệp ngay. Dùng khi `design.intro.gateway`.
   */
  hint: {
    vi: "Cổng sẽ mở ra trong vài giây trước khi vào thiệp.",
    en: "The gate opens for a few seconds before the invitation begins.",
  },
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  /** Dòng nhỏ in hoa trên tên hai người */
  eyebrow: { vi: "Hôn lễ của", en: "The wedding celebration of" },
  /** Lời chào mở đầu, đứng trên tên — đây là câu mời chính của thiệp */
  invitation: {
    vi: "Thân gửi quý khách, trân trọng kính mời tới dự hôn lễ của chúng tôi.",
    en: "Dear guests, we warmly invite you to the celebration of our wedding.",
  },
  /** Ảnh tách nền của cặp đôi, đứng trước tên hai người */
  portrait: {
    src: "/images/hero-couple.webp",
    alt: { vi: "Chú rể và cô dâu", en: "The groom and the bride" },
  },
};

/* -------------------------------------------------------------- LOVE STORY */

/** Không nằm trong `sections` của site này — giữ lại để bật nhanh nếu cần. */
export const loveStory = {
  eyebrow: { vi: "Chuyện của chúng mình", en: "Our story" },
  title: { vi: "Love Story", en: "Love Story" },
  intro: {
    vi: "Vuốt sang để xem những khoảnh khắc chúng mình giữ lại.",
    en: "Swipe through the moments we have kept.",
  },
  /** Nhãn điều khiển của băng ảnh — chỉ trình đọc màn hình và chữ nhắc nhỏ. */
  swipe: { vi: "Vuốt", en: "Swipe" },
  prev: { vi: "Chương trước", en: "Previous chapter" },
  next: { vi: "Chương sau", en: "Next chapter" },
  /** Mỗi chương là một thẻ trong băng ảnh kéo ngang. */
  chapters: [
    {
      year: "2020",
      title: { vi: "Lần đầu gặp nhau", en: "The first time we met" },
      body: {
        vi: "Một dòng kể ngắn về lần đầu hai người gặp nhau.",
        en: "A short line about the day we first met.",
      },
      photo: "/images/couple-01.jpg",
      alt: { vi: "Cô dâu và chú rể trong lần đầu gặp nhau", en: "The couple when they first met" },
    },
    {
      year: "2022",
      title: { vi: "Chính thức yêu", en: "Officially us" },
      body: {
        vi: "Một dòng kể ngắn về lúc hai người thành một đôi.",
        en: "A short line about becoming a couple.",
      },
      photo: "/images/couple-02.jpg",
      alt: { vi: "Cô dâu và chú rể khi mới yêu", en: "The couple early in their relationship" },
    },
    {
      year: "2024",
      title: { vi: "Cùng nhau đi khắp nơi", en: "Travelling together" },
      body: {
        vi: "Một dòng kể ngắn về những chuyến đi của hai người.",
        en: "A short line about the places we have been.",
      },
      photo: "/images/couple-03.jpg",
      alt: { vi: "Cô dâu và chú rể trong một chuyến đi", en: "The couple on a trip" },
    },
    {
      year: "2026",
      title: { vi: "Lời cầu hôn", en: "The proposal" },
      body: {
        vi: "Một dòng kể ngắn về lời cầu hôn.",
        en: "A short line about the proposal.",
      },
      photo: "/images/couple-04.jpg",
      alt: { vi: "Cô dâu và chú rể trong ngày cầu hôn", en: "The couple on the day of the proposal" },
    },
  ],
  /** Nhịp kết, đứng riêng dưới băng ảnh. Để null thì không hiện. */
  finale: {
    year: { vi: "Tháng 12 . 2026", en: "December . 2026" },
    title: { vi: "Và chúng mình cưới", en: "And we are getting married" },
    body: {
      vi: "Hẹn gặp quý khách trong ngày trọng đại.",
      en: "We hope to see you on our big day.",
    },
  },
};

/* ---------------------------------------------------------------- GALLERY */

/** Không nằm trong `sections` của site này — giữ lại để bật nhanh nếu cần. */
export const gallery = {
  eyebrow: { vi: "Album", en: "Album" },
  title: { vi: "Khoảnh khắc của chúng mình", en: "Our favourite moments" },
  note: { vi: "Những tấm hình chúng mình thương nhất.", en: "The photos we love most." },
  /** Chữ gợi ý cho người xem biết dải ảnh kéo ngang được. */
  hint: { vi: "Vuốt sang để xem tiếp", en: "Swipe for more" },
  shots: [
    { src: "/images/gallery-01.jpg", alt: { vi: "Ảnh cưới số 1", en: "Wedding photo 1" } },
    { src: "/images/gallery-02.jpg", alt: { vi: "Ảnh cưới số 2", en: "Wedding photo 2" } },
    { src: "/images/gallery-03.jpg", alt: { vi: "Ảnh cưới số 3", en: "Wedding photo 3" } },
    { src: "/images/gallery-04.jpg", alt: { vi: "Ảnh cưới số 4", en: "Wedding photo 4" } },
    { src: "/images/gallery-05.jpg", alt: { vi: "Ảnh cưới số 5", en: "Wedding photo 5" } },
    { src: "/images/gallery-06.jpg", alt: { vi: "Ảnh cưới số 6", en: "Wedding photo 6" } },
  ],
};

/* ------------------------------------------------------- TIME & VENUE */

/** Section "Time & Venue" — ngày giờ, địa điểm, gia đình hai bên. */
export const weddingInfo = {
  eyebrow: { vi: "Thời gian & Địa điểm", en: "Time & Venue" },
  title: { vi: "Ngày chúng mình về chung một nhà", en: "The day we become one family" },
  intro: {
    vi: "Kính mời quý khách tới dự tiệc mừng lễ thành hôn.",
    en: "We would be honoured to have you at our wedding reception.",
  },
  saveTheDateLabel: { vi: "Save the date", en: "Save the date" },
  venueLabel: { vi: "Địa điểm", en: "Venue" },
  calendarLabel: { vi: "Thêm vào lịch", en: "Add to calendar" },
  photo: "/images/couple-05.jpg",
  photoAlt: { vi: "Cô dâu và chú rể", en: "The bride and groom" },
};

/* ----------------------------------------------------------------- AGENDA */

export const agenda = {
  eyebrow: { vi: "Chương trình", en: "Agenda" },
  title: { vi: "Trình tự buổi lễ", en: "Order of the day" },
  intro: { vi: "Giờ dự kiến của buổi tiệc.", en: "The schedule we have planned." },
  /* Mỗi mục chỉ còn giờ và tên: bốn mốc nằm trong các ô giấy trống dọc dải
     sen, ô rộng khoảng 170px và cao 68px — thêm một dòng ghi chú nữa là tràn
     ra lá sen. Xem components/sections/Agenda.tsx. */
  items: [
    {
      time: "17:30",
      title: { vi: "Đón khách", en: "Welcome" },
    },
    {
      time: "18:00",
      title: { vi: "Làm lễ", en: "Ceremony" },
    },
    {
      time: "18:30",
      title: { vi: "Khai tiệc", en: "Dinner begins" },
    },
    {
      time: "19:30",
      title: { vi: "Tiệc sau lễ", en: "Celebration" },
    },
  ],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: { vi: "Trang phục", en: "Dress code" },
  title: { vi: "Dress Code", en: "Dress Code" },
  headline: { vi: "Thanh lịch & trang trọng", en: "Elegant & formal" },
  note: {
    vi: "Để khung hình ngày cưới thật hoà hợp, kính mời quý khách chọn trang phục theo bảng màu dưới đây.",
    en: "To keep the day looking its best, we would love you to dress in these colours.",
  },
  /** Để mảng rỗng thì phần bảng màu tự ẩn. Mã màu không dịch. */
  swatches: [
    { name: { vi: "Hồng phấn", en: "Dusty rose" }, hex: "#c96e99" },
    { name: { vi: "Tím lilac", en: "Lilac" }, hex: "#c49dcf" },
    { name: { vi: "Kem", en: "Cream" }, hex: "#edd9a3" },
    { name: { vi: "Xanh ô-liu", en: "Olive" }, hex: "#6d8c4c" },
  ],
  avoid: {
    vi: "Xin hạn chế trang phục màu trắng tinh của cô dâu.",
    en: "Please avoid bridal white.",
  },
};

/* ------------------------------------------------------------------- RSVP */

/**
 * RSVP đi qua Glow RSVP Hub. KHÔNG tự tạo Google Sheet, KHÔNG dán Apps Script:
 * chạy skill `glow-rsvp` để nó tạo Sheet và điền ba giá trị dưới đây.
 *
 *   mode "general"      — một form mở, ai có link site cũng trả lời được
 *   mode "personalized" — mỗi khách một link `?to=<slug>`, site gọi tên khách
 *
 * Form có bảy field, gửi lên hub đúng theo thứ tự này — cũng là thứ tự cột
 * trong Sheet của khách:
 *
 *   name · phone · side · attending · partySize · companions · message
 *
 * `partySize` và `companions` chỉ hỏi khi khách chọn "có đến"; `companions`
 * chỉ hiện khi khách đi nhiều hơn một người.
 *
 * Đổi field thì phải chạy lại để Sheet có cột tương ứng:
 *   ~/glow-tools/glow-rsvp.sh fields <client> --fields "key=Nhãn;…"
 */
export const rsvp = {
  mode: "general" as "general" | "personalized",
  /** URL của Glow RSVP Hub — skill glow-rsvp điền vào. */
  endpoint: "https://script.google.com/macros/s/AKfycbxB9Oc65toi-UmEfTB_J6d3l8LQoNQvhpyY1IaIIKR2h8I59K1NxvCGTZckTqLaT5y_/exec",
  /** Slug của khách, trùng subdomain: ten-khach.gloweb.site → "ten-khach" */
  client: "myphong",

  eyebrow: { vi: "R.S.V.P", en: "R.S.V.P" },
  title: { vi: "Quý khách sẽ đến chứ?", en: "Will you join us?" },
  note: {
    vi: "Nhắn giúp chúng mình một tiếng để gia đình chuẩn bị chỗ ngồi chu đáo.",
    en: "Let us know so our families can set a seat for you.",
  },
  deadline: {
    vi: "Vui lòng phản hồi trước ngày 10 . 12 . 2026",
    en: "Please reply before 10 . 12 . 2026",
  },

  fields: {
    name: {
      label: { vi: "Họ và tên", en: "Full name" },
      placeholder: { vi: "Nguyễn Văn A", en: "Your name" },
    },
    phone: {
      label: { vi: "Số điện thoại", en: "Phone number" },
      placeholder: { vi: "09xx xxx xxx", en: "09xx xxx xxx" },
    },
    /**
     * `value` là cái ghi vào Sheet — luôn tiếng Việt, để cột không lẫn hai
     * thứ tiếng tuỳ theo khách đang xem bản nào.
     */
    side: {
      label: { vi: "Quý khách là khách của", en: "You are a guest of" },
      options: [
        { value: "Nhà trai", label: { vi: "Nhà trai", en: "The groom's family" } },
        { value: "Nhà gái", label: { vi: "Nhà gái", en: "The bride's family" } },
      ],
    },
    attending: {
      label: { vi: "Quý khách có tham dự?", en: "Will you be there?" },
      yes: { vi: "Có, tôi sẽ đến", en: "Yes, I will be there" },
      no: { vi: "Rất tiếc, tôi xin vắng", en: "Sorry, I cannot make it" },
    },
    /**
     * Tổng số người đến, tính cả người đang điền form. Khách chọn bằng hai
     * nút − / + chứ không phải một dãy radio — xem `Stepper` trong
     * components/ui/Field.tsx.
     */
    partySize: {
      label: { vi: "Quý khách đi mấy người?", en: "How many of you are coming?" },
      /** Tiếng Anh đổi số ít / số nhiều, tiếng Việt thì không. */
      unit: {
        one: { vi: "người", en: "guest" },
        many: { vi: "người", en: "guests" },
      },
      decrease: { vi: "Bớt một người", en: "One guest fewer" },
      increase: { vi: "Thêm một người", en: "One more guest" },
      min: 1,
      max: 6,
    },
    companions: {
      label: { vi: "Tên những người đi cùng", en: "Names of your guests" },
      placeholder: {
        vi: "Mỗi người một dòng",
        en: "One name per line",
      },
    },
    message: {
      label: { vi: "Lời chúc gửi cô dâu chú rể", en: "A note for the couple" },
      placeholder: {
        vi: "Chúc hai bạn trăm năm hạnh phúc…",
        en: "Wishing you both a lifetime of happiness…",
      },
    },
  },

  submit: { vi: "Gửi phản hồi", en: "Send reply" },
  sending: { vi: "Đang gửi…", en: "Sending…" },
  successTitle: { vi: "Đã nhận được!", en: "We got it!" },
  successNote: {
    vi: "Cảm ơn quý khách. Chúng mình sẽ giữ sẵn một chỗ thật đẹp.",
    en: "Thank you. We will keep a good seat for you.",
  },
  errorNote: {
    vi: "Gửi chưa được, quý khách thử lại giúp chúng mình một lần nữa nhé.",
    en: "That did not go through — please try once more.",
  },
  editAnswer: { vi: "Sửa lại câu trả lời", en: "Edit my reply" },
  /** Chào khách vào bằng link riêng — chỉ dùng khi mode "personalized". */
  greeting: { vi: "Thân mời", en: "Dear" },
};

/* --------------------------------------------------------------- THANK YOU */

export const thankYou = {
  eyebrow: { vi: "Thank you", en: "Thank you" },
  title: { vi: "Cảm ơn quý khách", en: "Thank you" },
  lines: [
    {
      vi: "Cảm ơn quý khách đã dành thời gian",
      en: "Thank you for taking the time",
    },
    {
      vi: "đồng hành cùng chúng mình trong ngày trọng đại.",
      en: "to share our biggest day with us.",
    },
  ],
  signature: "Phong & My",
  image: "/images/couple-06.jpg",
  imageAlt: { vi: "Cô dâu và chú rể", en: "The bride and groom" },
};

/* ------------------------------------------------------------------ NHẠC */

/**
 * Nhạc nền. `src` để "" thì nút nhạc tự ẩn và trang vẫn chạy bình thường.
 * Nhạc chỉ bật từ chính cú chạm "Mở thiệp" — trình duyệt trên điện thoại
 * không cho phát nhạc ngoài một thao tác của người dùng.
 */
export const music = {
  src: "/audio/music.mp3",
  enabled: true,
  /** Tên bài hát không dịch. */
  title: "Tên bài hát — Nghệ sĩ",
  volume: 0.55,
  /** Nhãn cho trình đọc màn hình. */
  on: { vi: "Bật nhạc", en: "Play music" },
  off: { vi: "Tắt nhạc", en: "Pause music" },
};

/* ------------------------------------------------------------------- META */

/**
 * Thẻ meta chạy trên server, trước khi biết khách chọn tiếng nào — nên nó
 * cố định ở tiếng Việt, kèm một câu tiếng Anh trong description cho khách
 * nước ngoài thấy khi dán link.
 */
export const meta = {
  /** Domain thật của site — dùng để dựng link ảnh OG tuyệt đối. */
  siteUrl: "https://myphong.gloweb.site",
  title: "Hoa Quốc Phong & Bùi Huyền My — Thiệp cưới",
  description:
    "Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi ngày 20.12.2026. — Join us as we celebrate our wedding on 20.12.2026.",
  /** Ảnh hiện khi dán link lên Zalo / Facebook. */
  ogImage: "/images/hero.jpg",
  locale: "vi_VN",
  lang: "vi",
};
