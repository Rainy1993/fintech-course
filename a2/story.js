(function () {
  "use strict";

  const frames = [
    { image: "scene_01.png", speaker: "Setting", line: "Wolfgang, a mathematician at Humboldt University of Berlin, visits his old friend Janni." },
    { image: "scene_02.png", speaker: "Janni", line: "I bought Bitcoin on 1 July 2026." },
    { image: "btc_3month_daily_prices.svg", speaker: "Janni", line: "The latest daily BTC price return was −1.76%. Can past returns help me predict the next one?" },
    { image: "scene_04_returns_views_rear.png", speaker: "Wolfgang", line: "First, let’s study historical returns: their distribution and whether they show patterns over time." }
  ];

  const picture = document.getElementById("story-picture");
  const image = document.getElementById("story-image");
  const speaker = document.getElementById("story-speaker");
  const line = document.getElementById("story-line");
  const caption = document.querySelector(".story-caption");
  const progress = document.getElementById("story-progress");
  const previous = document.getElementById("story-previous");
  const next = document.getElementById("story-next");
  const expand = document.getElementById("story-expand");
  const dialog = document.getElementById("story-dialog");
  const dialogImage = document.getElementById("story-dialog-image");
  const dialogTitle = document.getElementById("story-dialog-title");
  const dialogCaption = document.getElementById("story-dialog-caption");
  const dialogClose = document.getElementById("story-dialog-close");
  if (!picture || !image || !speaker || !line || !progress || !previous || !next) return;

  let current = 0;
  function show(index) {
    current = Math.max(0, Math.min(frames.length - 1, index));
    const frame = frames[current];
    image.src = `../assets/storyboard_v2/${frame.image}`;
    image.alt = `Scene ${current + 1} of ${frames.length}: ${frame.speaker ? `${frame.speaker} says ` : "Concept: "}${frame.line}`;
    speaker.textContent = frame.speaker || "Key idea";
    line.textContent = frame.line;
    caption.hidden = Boolean(frame.captionInImage);
    document.getElementById("python-story-prices").hidden = current !== 2;
    progress.textContent = `${current + 1} / ${frames.length}`;
    previous.disabled = current === 0;
    next.disabled = current === frames.length - 1;
    picture.setAttribute("aria-label", current === frames.length - 1 ? "Last scene" : `Show next scene, ${current + 2} of ${frames.length}`);
  }
  picture.addEventListener("click", () => show(current + 1));
  expand.addEventListener("click", () => { dialogImage.src = image.src; dialogImage.alt = image.alt; dialogTitle.textContent = `Scene ${current + 1} / ${frames.length}`; dialogCaption.textContent = frames[current].line; dialog.hidden = false; document.body.classList.add("story-expanded"); dialogClose.focus(); });
  dialogClose.addEventListener("click", () => { dialog.hidden = true; document.body.classList.remove("story-expanded"); expand.focus(); });
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !dialog.hidden) { dialog.hidden = true; document.body.classList.remove("story-expanded"); expand.focus(); } });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) { dialog.hidden = true; document.body.classList.remove("story-expanded"); expand.focus(); } });
  document.getElementById("story").addEventListener("keydown", (event) => {
    if (!dialog.hidden) return;
    if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
  });
  show(0);
})();
