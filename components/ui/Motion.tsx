"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion } from "@/content/theme";

gsap.registerPlugin(ScrollTrigger);

/** Sự kiện phát ra khi khách bấm "Mở thiệp" — ExperienceProvider bắn ra. */
export const OPEN_EVENT = "glow:open";

/**
 * Toàn bộ chuyển động của trang, gom vào một chỗ:
 *
 *   [data-reveal]        hiện dần khi cuộn tới (một batch cho cả trang)
 *   [data-parallax="N"]  trôi chậm hơn trang N% khi cuộn
 *   [data-hero]          hiện khi thiệp được mở, không chờ cuộn
 *
 * Section chỉ cần gắn attribute, không section nào tự gọi GSAP — nhờ vậy
 * chúng vẫn là server component và không có hai hệ animation chạy song song.
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ai tắt hiệu ứng thì hiện hết ngay, không dựng trigger nào.
    if (reduce) {
      gsap.set("[data-reveal]", { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]:not([data-hero])", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          for (const node of batch as HTMLElement[]) {
            const delay = Number(node.dataset.revealDelay ?? 0) / 1000;
            gsap.fromTo(
              node,
              { opacity: 0, y: motion.revealDistance },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                delay,
                overwrite: "auto",
              },
            );
          }
        },
      });

      for (const node of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
        gsap.to(node, {
          yPercent: -Number(node.dataset.parallax),
          ease: "none",
          scrollTrigger: {
            trigger: node.closest("section") ?? node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    /*
      Hero nằm ngay dưới màn mở thiệp nên không bao giờ "cuộn tới" — nó hiện
      theo chính cú chạm mở thiệp. Nếu trang không có màn mở thiệp thì
      ExperienceProvider bắn sự kiện này ngay khi mount.
    */
    /*
      Hero hiện ra sau cú chạm mở thiệp. Nhịp ở đây CỐ Ý chậm hơn hẳn các
      khối cuộn tới: thiệp vừa đi qua một cảnh mở cổng dài gần sáu giây, nên
      hero bật lên trong hơn một giây là hẫng. Ba con số làm việc đó:

        duration 1.9   đủ dài để mắt thấy chuyển động chứ không thấy cú nhảy
        stagger  0.3   ngày giờ → tên hai người → câu mời, lần lượt
        power2.out     giảm tốc đều, không giật ở đầu như power3

      Tổng cộng khối cuối cùng ổn định ở khoảng giây thứ 3,3 — trùng với lúc
      nhạc đã vào và lớp cổng tan hẳn.
    */
    const onOpen = () => {
      // Các khối chữ: nhích lên một quãng ngắn rồi hiện.
      gsap.fromTo(
        "[data-hero]:not([data-hero-soft])",
        { opacity: 0, y: 18, scale: 1.012 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.9,
          ease: "power2.out",
          stagger: 0.3,
          delay: 0.25,
          overwrite: "auto",
        },
      );

      /*
        Ảnh cặp đôi thì KHÔNG trượt. Ảnh đã tách nền nên khi nó dịch lên,
        mắt thấy một người bị cắt rời đang trôi trên nền đứng yên — hỏng
        ngay cái ảo giác "người đứng trong khung cảnh". Thay bằng một cú
        rõ nét dần: ảnh đứng im tại chỗ, chỉ tan sương ra.
      */
      gsap.fromTo(
        "[data-hero-soft]",
        { opacity: 0, filter: "blur(18px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 2.2,
          ease: "power2.out",
          delay: 0.55,
          overwrite: "auto",
        },
      );
      ScrollTrigger.refresh();
    };

    window.addEventListener(OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      ctx.revert();
    };
  }, []);

  return null;
}
