(function () {
  "use strict";

  const links = Array.from(document.querySelectorAll('.left-nav a[href^="#"]'));
  const sections = links.map((link) => document.querySelector(link.getAttribute("href")));
  if (sections.some((section) => !section)) return;

  let scheduled = false;
  function updateCurrentSection() {
    scheduled = false;
    const readingLine = 160;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine) current = index;
    });
    links.forEach((link, index) => {
      link.classList.toggle("active", index === current);
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateCurrentSection();
})();
