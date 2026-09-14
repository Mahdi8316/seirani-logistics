(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toFa(s) {
    var fa = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
    return String(s).replace(/[0-9]/g, function (d) { return fa[+d]; }).replace(/,/g, "٬");
  }

  // ---- پخش ویدیوها ----
  var videos = document.querySelectorAll("video");
  Array.prototype.forEach.call(videos, function (vid) {
    vid.muted = true;
    vid.loop = true;
    vid.setAttribute("playsinline", "");
    vid.addEventListener("ended", function () { vid.currentTime = 0; vid.play().catch(function () {}); });
    vid.play().catch(function () {});
  });

  // ---- آشکارسازی هنگام اسکرول ----
  var reveals = document.querySelectorAll("[data-reveal]");
  Array.prototype.forEach.call(reveals, function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(34px)";
    el.style.transition = "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)";
  });
  if ("IntersectionObserver" in window) {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = "1";
          en.target.style.transform = "none";
          rObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(reveals, function (el) { rObs.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
  }

  // ---- شمارنده‌ها ----
  var counters = document.querySelectorAll("[data-count]");
  Array.prototype.forEach.call(counters, function (el) {
    var suffix = el.getAttribute("data-suffix") || "";
    if (!reduce) el.textContent = toFa("0") + suffix;
  });
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cObs.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduce) { el.textContent = toFa(target.toLocaleString("en-US")) + suffix; return; }
        var dur = 1600, t0 = performance.now();
        function step(now) {
          var p = Math.min(1, (now - t0) / dur);
          var val = Math.round(target * (1 - Math.pow(1 - p, 3)));
          el.textContent = toFa(val.toLocaleString("en-US")) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(counters, function (el) { cObs.observe(el); });
  }
})();
