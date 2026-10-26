import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ảnh khách là file tĩnh trong public/, không qua loader ngoài.
  images: {
    formats: ["image/avif", "image/webp"],
    /*
      Mức nén mặc định (75) phá vân giấy. Giấy là nhiễu rất nhạt, biên độ chỉ
      vài mức trên 255; nén mạnh gộp nó thành từng mảng phẳng và mỗi mảng lệch
      nhau một hai mức — ở chỗ nối hai section, hai mảng cạnh nhau lệch tới 5
      mức và hiện ra thành một vạch ngang.

      95 cho lớp nền và lớp tranh (xem `quality` ở SectionWrapper / Decor);
      75 vẫn là mặc định cho ảnh chụp, nơi mắt không bắt được khác biệt.
    */
    qualities: [75, 95],
  },
};

export default nextConfig;
