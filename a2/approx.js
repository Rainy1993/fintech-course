(function () {
  "use strict";
  const plot = document.getElementById("return-comparison-plot");
  const gapFill = document.getElementById("comparison-gap-fill");
  const gapValue = document.getElementById("comparison-gap-value");
  if (!plot || !gapFill || !gapValue) return;
  let current = 4.344;
  const left = 70, right = 700, top = 98, bottom = 355;
  const x = (simplePct) => left + (simplePct + 30) / 60 * (right - left);
  const y = (returnPct) => bottom - (returnPct + 36) / 66 * (bottom - top);
  const logPct = (simplePct) => 100 * Math.log1p(simplePct / 100);
  const signed = (number) => `${number >= 0 ? "+" : "−"}${Math.abs(number).toFixed(3)}%`;
  const baseCurve = (fn) => Array.from({ length: 241 }, (_, i) => { const r = -30 + i / 4; return `${x(r).toFixed(1)},${y(fn(r)).toFixed(1)}`; }).join(" ");
  const base = `<rect width="760" height="420" fill="#fff"/><path d="M${left} ${top}V${bottom}H${right}" stroke="#9cafbb" stroke-width="2" fill="none"/><path d="M${x(0)} ${top}V${bottom} M${left} ${y(0)}H${right}" stroke="#e0e7e3" stroke-width="1.5" fill="none"/><polyline points="${baseCurve(r => r)}" fill="none" stroke="#c87229" stroke-width="4"/><polyline points="${baseCurve(logPct)}" fill="none" stroke="#0e8d84" stroke-width="4"/>${[-30,-20,-10,0,10,20,30].map(v => `<text x="${x(v)}" y="378" text-anchor="middle" fill="#52697d" font-size="15">${v}%</text>`).join("")}<text x="385" y="406" text-anchor="middle" fill="#52697d" font-size="16">Simple return (%)</text><text x="71" y="75" fill="#52697d" font-size="16">Return (%)</text><line x1="73" y1="86" x2="103" y2="86" stroke="#c87229" stroke-width="4"/><text x="110" y="91" fill="#52697d" font-size="14">Simple return</text><line x1="240" y1="86" x2="270" y2="86" stroke="#0e8d84" stroke-width="4"/><text x="277" y="91" fill="#52697d" font-size="14">Log return</text>`;
  function show(simplePct) {
    const r = Math.max(-30, Math.min(30, simplePct));
    const g = logPct(r);
    const diff = r - g;
    const px = x(r);
    const overlay = `<path d="M${px.toFixed(1)} ${top}V${bottom}" stroke="#879ba8" stroke-width="1.5" stroke-dasharray="5 5"/><circle cx="${px.toFixed(1)}" cy="${y(r).toFixed(1)}" r="7" fill="#c87229" stroke="white" stroke-width="2"/><circle cx="${px.toFixed(1)}" cy="${y(g).toFixed(1)}" r="7" fill="#0e8d84" stroke="white" stroke-width="2"/><rect x="492" y="7" width="245" height="61" rx="7" fill="#f3f6f3" stroke="#dbe4df"/><text x="507" y="29" fill="#a35d43" font-size="15" font-weight="700">Simple return: ${signed(r)}</text><text x="507" y="53" fill="#0e736c" font-size="15" font-weight="700">Log return: ${signed(g)}</text>`;
    plot.innerHTML = base + overlay;
    plot.setAttribute("aria-label", `At simple return ${signed(r)}, log return is ${signed(g)}. Simple minus log is ${diff.toFixed(3)} percentage points.`);
    current = r;
    gapFill.style.width = `${Math.min(100, diff / 6 * 100).toFixed(2)}%`;
    gapValue.textContent = `+${diff.toFixed(3)} pp`;
  }
  plot.addEventListener("pointermove", (event) => {
    const bounds = plot.getBoundingClientRect();
    const viewX = (event.clientX - bounds.left) / bounds.width * 760;
    if (viewX < left || viewX > right) return;
    show((viewX - left) / (right - left) * 60 - 30);
  });
  plot.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowRight" ? 1 : -1) * (event.shiftKey ? 5 : 0.5));
    }
  });
  show(current);
})();
