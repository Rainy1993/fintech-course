(function () {
  "use strict";
  const figure = document.getElementById("return-animation");
  const replay = document.getElementById("replay-return-animation");
  if (!figure || !replay) return;
  let started = false;
  function start() {
    figure.classList.remove("playing");
    void figure.offsetWidth;
    figure.classList.add("playing");
    started = true;
  }
  replay.addEventListener("click", start);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!started && entries.some((entry) => entry.isIntersecting)) {
        start();
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(figure);
  } else start();
})();
