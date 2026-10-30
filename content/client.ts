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
   * Mép trên/dưới của section nhoè đi để chỗ nối với section bên cạnh không
   * thành một đường kẻ. Mặc định bật.
   *
   * `false` cho section nào mà mép là một phần của bố cục chứ không phải chỗ
   * nối — màn mở thiệp và hero: ảnh của chúng phải ăn hết khung, nhoè mép là
   * hiện ra một dải màu nền viền quanh ảnh.
   */
  seam?: boolean;
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
  /*
    Màn mở thiệp là cổng Bình phong (components/ui/Garden.tsx): tranh, mặt
    trời, tre, bướm đều nằm trong code của cổng nên không có `background` ở
    đây. Cổng Huế cũ đã archive — xem archive/hue-gateway/README.md.
  */
  intro: {
    anchor: "intro",
    tone: "garden",
    seam: false,
  },
  /* `seam: false`: ảnh cặp đôi phải ăn hết khung hero. Nhoè mép là hiện ra
     một viền nâu ô-liu chạy ngang trên và dưới bức ảnh. */
  hero: {
    anchor: "hero",
    tone: "dark",
    background: "/images/hero-m275.jpg",
    overlay: 0,
    seam: false,
  },
  loveStory: { anchor: "love-story", tone: "paper" },
  gallery: { anchor: "gallery", tone: "light" },
  /*
    Tranh mực của khách giữ nguyên tỉ lệ và nguyên nét, nhưng CẮT LÀM HAI ở
    35% — ngay giữa khoảng giấy trống của chính bức tranh. Lát trên (dải lụa
    hồng) neo đỉnh section, lát dưới (mái đình, lụa xanh) neo đáy, cột chữ
    nằm trên giấy giữa hai lát và giấy đó giãn theo chiều dài của chữ.

    Vì sao không để nguyên một tấm: khoảng trống trong tranh chỉ cao 31% bức
    tranh, còn cột chữ cao gấp đôi thế — để nguyên thì chữ đè lên dải lụa.
    Xem components/sections/WeddingInfo.tsx.
  */
  /* Time & Venue là một tờ giấy phẳng tông be vàng, không có ảnh nền: bố cục
     (ngày, thẻ địa điểm, đường vào) dựng trong components/sections/WeddingInfo.tsx. */
  weddingInfo: { anchor: "wedding-info", tone: "garden" },
  /*
    Dải sen của khách, dùng nguyên bản trong một khung 9:16. Chữ của section
    nằm trong năm ô giấy trống so le hai bên dải sen — toạ độ đo bằng tương
    phản, xem components/sections/Agenda.tsx.
  */
  /* Agenda là một tấm khung hoạ tiết dựng bằng SVG + chữ trong
     components/sections/Agenda.tsx; section chỉ cần tông. */
  agenda: { anchor: "agenda", tone: "garden" },
  /* Tranh tre + núi của khách, cắt làm hai lát (tre ở đỉnh, núi ở chân) và đặt
     thẳng trong components/sections/Dresscode.tsx — không gắn làm `decor` ở đây. */
  dresscode: { anchor: "dresscode", tone: "garden" },
  /* Tấm thiệp được DỰNG trong components/sections/Rsvp.tsx từ ba lát cắt,
     vì nó phải kéo dài theo form — không gắn làm `decor` ở đây được. Ba lát đã
     đổi giấy sang màu nền `garden` và hai đèn lồng đã thành trắng ngà
     (scripts/recolor-paper.mjs); ô giấy của thiệp giữ màu kem sáng. */
  rsvp: { anchor: "rsvp", tone: "garden" },
  /* Ảnh cưới hoà vào giấy — xem components/sections/ThankYou.tsx. Cùng tông
     `garden` và không có ảnh nền riêng như RSVP, để chân mây của thiệp tan vào
     đúng màu giấy mà đỉnh ảnh cưới tan ra — hai bên đường nối cùng một màu. */
  thankYou: {
    anchor: "thank-you",
    tone: "garden",
  },
};

/* ------------------------------------------------------------------ COUPLE */

/** Tên người: bản tiếng Anh dùng tên quốc tế của hai bạn. */
export const couple: { groom: L; bride: L; groomFull: L; brideFull: L } = {
  /** Tên ngắn, dùng ở tiêu đề sự kiện trên lịch */
  groom: { vi: "Phong", en: "Steven" },
  bride: { vi: "My", en: "Mia" },
  /** Tên đầy đủ, dùng trong phần thông tin lễ cưới */
  groomFull: { vi: "Hoa Quốc Phong", en: "Steven QP Hoa" },
  brideFull: { vi: "Bùi Huyền My", en: "Mia HM Bui" },
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
  startISO: "2027-01-10T17:30:00+07:00",
  /** Giờ tan tiệc — chỉ dùng cho link thêm vào lịch. */
  endISO: "2027-01-10T21:30:00+07:00",
  weekday: { vi: "Chủ Nhật", en: "Sunday" },
  dateShort: "10 . 01 . 2027",
  timeLabel: "17:30",
  /** Ngày âm — gia đình tự đọc, không tính tự động. */
  lunar: {
    vi: "Tức ngày mùng 3 tháng Chạp năm Bính Ngọ",
    en: "The 3rd day of the 12th lunar month, Year of the Fire Horse",
  },
};

export const venue = {
  name: "Fairmont Hanoi",
  hall: { vi: "Grand Ballroom · Tầng B1", en: "Grand Ballroom · Floor B1" },
  address: "27–29 Lý Thái Tổ, Hoàn Kiếm, Hà Nội",
  /** Link Maps của khách. Nên dùng link chia sẻ ghim sẵn, đừng để ?query= tự tìm. */
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+Hanoi+27-29+Ly+Thai+To",
  mapLabel: { vi: "Xem bản đồ", en: "Open in Maps" },
  /**
   * Đường vào phòng tiệc — từng bước một. Mỗi bước là ba đoạn nối liền
   * `before` + `em` + `after`; chỉ `em` được nhấn (đậm, màu chữ chính), hai đoạn
   * còn lại có thể bỏ. Bước cuối được đánh dấu bằng viên thoi đặc.
   */
  directions: {
    label: { vi: "Đường vào phòng tiệc", en: "Finding the ballroom" },
    steps: [
      {
        em: { vi: "Cổng Sự kiện", en: "Events entrance" },
        after: { vi: " khách sạn Fairmont, số 27–29 Lý Thái Tổ", en: " of the Fairmont hotel, 27–29 Lý Thái Tổ" },
      },
      {
        before: { vi: "Đi theo ", en: "Take the " },
        em: { vi: "thang cuốn", en: "escalator" },
        after: { vi: " xuống tầng B1", en: " down to floor B1" },
      },
      {
        before: { vi: "Đến ", en: "Arrive at the " },
        em: { vi: "Grand Ballroom", en: "Grand Ballroom" },
      },
    ] as { before?: L; em: L; after?: L }[],
  },
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  /** Dòng nhỏ in hoa trên tên hai người, cột phải của tranh */
  eyebrow: { vi: "Lễ thành hôn", en: "The wedding of" },
  /** Tên hiển thị trên màn mở thiệp: ngắn hơn `couple.groomFull` / `brideFull` cho vừa cột hẹp */
  names: {
    groom: { vi: "Quốc Phong", en: "Steven QP Hoa" } as L,
    bride: { vi: "Huyền My", en: "Mia HM Bui" } as L,
  },
  /** "Thân mời" + người nhận. Thiệp chung cho mọi khách nên người nhận là "Quý khách". */
  inviteLabel: { vi: "Thân mời", en: "Cordially inviting" },
  guest: { vi: "Quý khách", en: "Our guests" },
  /** Dòng chữ dọc ở dải nâu bên trái */
  vertical: { vi: "Trân trọng kính mời", en: "With warm regards" },
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: { vi: "Mở thiệp", en: "Open" },
  /** Dòng chữ nghiêng dưới nút */
  tap: { vi: "chạm để mở", en: "tap to open" },
  /**
   * Chỉ trình đọc màn hình nghe thấy: báo trước rằng bấm nút sẽ chạy một cảnh
   * vài giây (mặt trời lộ ra, bướm bay) chứ không vào thiệp ngay.
   */
  hint: {
    vi: "Tranh sẽ chuyển động vài giây trước khi vào thiệp.",
    en: "The scene moves for a few seconds before the invitation begins.",
  },
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  /** Dòng nhỏ in hoa trên cùng, đứng trên tên thiệp */
  eyebrow: { vi: "Trân trọng báo hỷ", en: "With joy we announce" },
  /**
   * Tên của tấm thiệp, chữ lớn nhất trang. Xuống dòng bằng `\n` — Hero in ra
   * với `whitespace-pre-line`, nên chỗ ngắt dòng do nội dung quyết định chứ
   * không phải do component.
   */
  title: { vi: "Ngày\nChung Đôi", en: "The Day\nWe Marry" },
  /** Nhãn nhỏ của gợi ý cuộn ở đáy hero */
  scrollHint: { vi: "Cuộn xuống", en: "Scroll" },
  /** Câu mời, đứng ngay dưới tên thiệp */
  invitation: {
    vi: "Chúng tôi và gia đình kính mời quý khách tới chung vui.",
    en: "Together with our families, we warmly invite you to celebrate with us.",
  },
  /** Nhãn nhỏ in hoa đứng trên tên từng người ở chân trang bìa */
  roles: {
    groom: { vi: "Chú rể", en: "Groom" },
    bride: { vi: "Cô dâu", en: "Bride" },
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
  /** Dòng nhỏ trên tiêu đề "Save the Date" */
  inviteLabel: { vi: "Trân trọng kính mời", en: "With their families" },
  /** `\n` xuống dòng: "Save" một dòng, "the Date" dòng dưới */
  saveTheDateLabel: { vi: "Tham dự\nHôn lễ", en: "Save\nthe Date" },
  timeLabel: { vi: "Thời gian", en: "Time" },
  /** Nhãn ô giờ, cạnh ô ngày: giờ đón khách = `ceremony.timeLabel` */
  receptionLabel: { vi: "Đón khách", en: "Reception" },
  venueLabel: { vi: "Địa điểm", en: "Venue" },
  calendarLabel: { vi: "Thêm vào lịch", en: "Add to calendar" },
  /** Ảnh cổng vòm ở đầu section, tỉ lệ 2:3 */
  photo: "/images/couple/P.M1905.jpg",
  photoAlt: { vi: "Cô dâu và chú rể", en: "The bride and groom" },
};

/* ----------------------------------------------------------------- AGENDA */

export const agenda = {
  eyebrow: { vi: "Chương trình", en: "Schedule" },
  title: { vi: "Trình tự buổi lễ", en: "Order of the day" },
  /** Ảnh ở đầu tấm khung, tỉ lệ ~1:1 (public/images/agenda.webp) */
  photo: "/images/agenda.webp",
  photoAlt: {
    vi: "Cô dâu chú rể trong áo nhật bình đỏ đứng giữa hành lang gỗ, phía sau là vườn cây xanh",
    en: "The couple in red ceremonial dress on a timber veranda, a green garden behind them",
  },
  /* Mỗi mục chỉ còn giờ và tên. Bốn mốc đậu so le hai bên đường thời gian ở
     giữa — mục `highlight` được đánh dấu bằng ấn 囍 thay cho viên thoi. Xem
     components/sections/Agenda.tsx. */
  items: [
    {
      time: "17:30",
      title: { vi: "Đón khách", en: "Welcome" },
    },
    {
      time: "18:30",
      title: { vi: "Làm lễ", en: "Ceremony" },
      highlight: true,
    },
    {
      time: "19:00",
      title: { vi: "Khai tiệc", en: "Dinner" },
    },
  ] as { time: string; title: L; highlight?: boolean }[],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: { vi: "Màu sắc", en: "Dress code" },
  title: { vi: "Gợi ý màu\ntrang phục", en: "Suggested outfit palette" },
  /**
   * Để mảng rỗng thì phần bảng màu tự ẩn. Mã màu không dịch.
   * Lấy từ bảng giấy màu khách gửi; xếp từ nhạt đến đậm theo hai hàng bốn ô.
   */
  swatches: [
    { name: { vi: "Kem", en: "Ivory" }, hex: "#ddd6c3" },
    { name: { vi: "Be cát", en: "Sand" }, hex: "#cdbb9e" },
    { name: { vi: "Nude", en: "Blush" }, hex: "#d9b69f" },
    { name: { vi: "Sage", en: "Sage" }, hex: "#aca581" },
    { name: { vi: "Đồng", en: "Bronze" }, hex: "#7d623e" },
    { name: { vi: "Đỏ nâu", en: "Marsala" }, hex: "#75433e" },
    { name: { vi: "Rêu", en: "Forest" }, hex: "#434942" },
    { name: { vi: "Đen", en: "Black" }, hex: "#1a1a1a" },
  ],
  avoid: {
    vi: "* bảng màu trên chỉ mang tính tham khảo",
    en: "* the palette above is for reference only",
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
        { value: "Nhà trai", label: { vi: "Nhà trai", en: "Groom" } },
        { value: "Nhà gái", label: { vi: "Nhà gái", en: "Bride" } },
      ],
    },
    attending: {
      label: { vi: "Quý khách có tham dự?", en: "Will you be there?" },
      /* Hai lựa chọn đứng cạnh nhau trên một hàng, nên nhãn phải ngắn —
         cột chữ trong tấm thiệp chỉ rộng hơn 200px. Chuỗi gửi lên Sheet là
         "yes"/"no", không phải nhãn này. */
      yes: { vi: "Sẽ đến", en: "Yes" },
      no: { vi: "Xin vắng", en: "No" },
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
  eyebrow: { vi: "Thank you", en: "With gratitude" },
  title: { vi: "Cảm ơn quý khách", en: "Thank you" },
  lines: [
    {
      vi: "Sự hiện diện của quý khách",
      en: "Your presence is the greatest gift",
    },
    {
      vi: "là niềm vinh dự của gia đình chúng tôi.",
      en: "to us and our families.",
    },
  ],
  signature: "Phong & My",
  image: "/images/thankyou.webp",
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
    "Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi ngày 10.01.2027. — Join us as we celebrate our wedding on 10.01.2027.",
  /** Ảnh hiện khi dán link lên Zalo / Facebook. */
  ogImage: "/images/og.jpg",
  locale: "vi_VN",
  lang: "vi",
};
