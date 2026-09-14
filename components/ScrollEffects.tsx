"use client";

import { useEffect } from "react";
import { toFa } from "@/lib/persian";

/**
 * تمام رفتارهای سمت‌کلاینت (مطابق componentDidMount پروتوتایپ):
 *  - پخش اجباری ویدئوها (muted / loop / playsinline + حلقه‌ی پشتیبان)
 *  - پارالاکس Hero با هموارسازی RAF (lerp) و احترام به prefers-reduced-motion
 *  - آشکارسازی هنگام اسکرول (data-reveal)
 *  - شمارش صعودی (data-count / data-suffix) با easeOutCubic و اعداد فارسی
 */
export default function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- پخش ویدئوها -------------------------------------------------------
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
    const endedHandlers: Array<[HTMLVideoElement, () => void]> = [];
    videos.forEach((vid) => {
      vid.muted = true;
      vid.loop = true;
      vid.setAttribute("playsinline", "");
      const onEnded = () => {
        vid.currentTime = 0;
        void vid.play().catch(() => {});
      };
      vid.addEventListener("ended", onEnded);
      endedHandlers.push([vid, onEnded]);
      void vid.play().catch(() => {});
    });

    // ---- پارالاکس Hero -----------------------------------------------------
    const hero = document.getElementById("hero");
    const media = document.querySelector<HTMLElement>("[data-hero-media]");
    const copy = document.querySelector<HTMLElement>("[data-hero-copy]");

    let target = 0;
    let current = 0;
    let raf = 0;

    const apply = (p: number) => {
      if (media) {
        media.style.transform = `scale(${1.06 + p * 0.1}) translateY(${p * -40}px)`;
      }
      if (copy) {
        copy.style.opacity = String(Math.max(0, 1 - p * 2.1));
        copy.style.transform = `translateY(${p * -60}px)`;
      }
    };

    const onScroll = () => {
      if (!hero) return;
      const max = hero.offsetHeight - window.innerHeight;
      const top = hero.getBoundingClientRect().top;
      target = max > 0 ? Math.min(1, Math.max(0, -top / max)) : 0;
      if (reduce) apply(target);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    if (!reduce) {
      const tick = () => {
        raf = requestAnimationFrame(tick);
        current += (target - current) * 0.08;
        apply(current);
      };
      tick();
    }

    // ---- آشکارسازی هنگام اسکرول -------------------------------------------
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    reveals.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(34px)";
      el.style.transition =
        "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)";
    });
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    // ---- شمارش صعودی -------------------------------------------------------
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    counters.forEach((el) => {
      const suffix = el.getAttribute("data-suffix") ?? "";
      // شروع از صفر هنگام حضور JS (نسخه‌ی SSR مقدار نهایی را برای SEO دارد).
      if (!reduce) el.textContent = toFa("0") + suffix;
    });
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          countObserver.unobserve(el);
          const targetVal = parseFloat(el.getAttribute("data-count") || "0") || 0;
          const suffix = el.getAttribute("data-suffix") || "";
          if (reduce) {
            el.textContent = toFa(targetVal.toLocaleString("en-US")) + suffix;
            return;
          }
          const dur = 1600;
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            const val = Math.round(targetVal * (1 - Math.pow(1 - p, 3)));
            el.textContent = toFa(val.toLocaleString("en-US")) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countObserver.observe(el));

    // ---- پاک‌سازی ----------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      endedHandlers.forEach(([vid, handler]) => vid.removeEventListener("ended", handler));
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return null;
}
