(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const btcDays = window.A2BTC;
  const startPrice = btcDays[0].price;
  const initial = btcDays.slice(1).map((row, i) => 100 * Math.log(row.price / btcDays[i].price));
  let returns = initial.slice();
  let shuffled = false;
  const axis = '<path d="M39 20V181H389" fill="none" stroke="#9cafbb" stroke-width="1.5"/>';
  const tx = (x, y, value, anchor = "middle") => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" fill="#50677a">${value}</text>`;
  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const svg = (id, markup, description) => { const node = $(id); node.innerHTML = markup; node.setAttribute("aria-label", description); };
  const prices = () => {
    const path = [startPrice];
    returns.forEach((r) => path.push(path.at(-1) * Math.exp(r / 100)));
    return path;
  };
  function drawPricePath(values) {
    const low = Math.floor(Math.min(...values) / 5000) * 5000;
    const high = Math.ceil(Math.max(...values) / 5000) * 5000;
    const left = 64, right = 382;
    const x = (i) => left + (right - left) * i / (values.length - 1);
    const y = (v) => 180 - 150 * (v - low) / (high - low || 1);
    const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const endpoints = [0, values.length - 1].map((i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="4" fill="#2167a0"/>`).join("");
    const priceAxis = `<path d="M${left} 20V181H389" fill="none" stroke="#9cafbb" stroke-width="1.5"/>`;
    svg("price-path", `${priceAxis}${tx(left - 7, 29, high.toLocaleString("en-US"), "end")}${tx(left - 7, 181, low.toLocaleString("en-US"), "end")}${tx(left, 204, "7 Apr", "start")}${tx(right, 204, "8 Jul", "end")}<polyline points="${points}" fill="none" stroke="#2167a0" stroke-width="2.5" stroke-linejoin="round"/>${endpoints}`, `BTC price path over 93 dates. Starts at USD ${money(startPrice)} and ends at USD ${money(values.at(-1))}. ${shuffled ? "This reordered path is hypothetical." : "This is the observed daily average price path."}`);
  }
  function drawReturnBars() {
    const range = Math.ceil(Math.max(5, ...returns.map((r) => Math.abs(r))));
    const zero = 103;
    const w = 343 / returns.length;
    const bars = returns.map((r, i) => {
      const h = Math.abs(r) / range * 73;
      return `<rect x="${(40 + i * w).toFixed(2)}" y="${(r >= 0 ? zero - h : zero).toFixed(2)}" width="${Math.max(1.6, w - 0.6).toFixed(2)}" height="${Math.max(1, h).toFixed(2)}" fill="${r >= 0 ? "#0e8d84" : "#c87229"}"><title>${btcDays[i + 1].date}: ${r.toFixed(2)}%${shuffled ? " (hypothetical order)" : ""}</title></rect>`;
    }).join("");
    svg("return-bars", `${axis}<path d="M39 ${zero}H389" stroke="#7f93a3" stroke-dasharray="3 3"/>${tx(33, 29, `+${range}%`, "end")}${tx(33, 107, "0%", "end")}${tx(33, 181, `−${range}%`, "end")}${tx(39, 204, "8 Apr")}${tx(382, 204, "8 Jul", "end")}${bars}`, `Sequence of ${returns.length} BTC daily log returns; ${shuffled ? "hypothetically shuffled" : "observed order"}.`);
  }
  function drawHistogram(id, values, binCount, fill, unit, fixedRange) {
    const low = fixedRange ? fixedRange[0] : Math.floor(Math.min(...values) / 5000) * 5000;
    const high = fixedRange ? fixedRange[1] : Math.ceil(Math.max(...values) / 5000) * 5000;
    const step = (high - low) / binCount;
    const bins = Array(binCount).fill(0);
    values.forEach((v) => {
      const i = Math.max(0, Math.min(binCount - 1, Math.floor((v - low) / step)));
      bins[i]++;
    });
    const max = Math.max(...bins, 1);
    const w = 343 / binCount;
    const fmt = (v) => unit === "USD" ? Math.round(v).toLocaleString("en-US") : `${v.toFixed(1)}%`;
    const bars = bins.map((n, i) => {
      const h = n / max * 140;
      return `<rect x="${(40 + i * w).toFixed(1)}" y="${(180 - h).toFixed(1)}" width="${(w - 1.5).toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"><title>${fmt(low + i * step)} to ${fmt(low + (i + 1) * step)}: ${n} days</title></rect>`;
    }).join("");
    svg(id, `${axis}${tx(33, 29, max, "end")}${tx(33, 181, "0", "end")}${tx(40, 204, fmt(low), "start")}${tx(382, 204, fmt(high), "end")}${bars}`, `${binCount}-bin histogram of ${values.length} ${unit === "USD" ? "daily BTC prices" : "daily BTC log returns"}. Bin counts: ${bins.join(", ")}.`);
  }
  function update() {
    const values = prices();
    $("final-price").textContent = money(values.at(-1));
    $("loss-days").textContent = String(returns.filter((r) => r < 0).length);
    $("sequence-label").textContent = shuffled ? "Shuffled" : "Observed";
    drawPricePath(values);
    drawReturnBars();
    drawHistogram("price-hist", values.slice(1), 18, "#2167a0", "USD");
    drawHistogram("return-hist", returns, 20, "#0e8d84", "%", [-6, 6]);
  }
  $("shuffle-returns").addEventListener("click", () => {
    for (let i = returns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [returns[i], returns[j]] = [returns[j], returns[i]];
    }
    shuffled = true;
    update();
    $("game-feedback").className = "feedback good";
    $("game-feedback").textContent = "The log-return histogram and final price are unchanged. The order, intermediate price path, and price histogram may change. A histogram cannot show when returns occurred.";
  });
  $("reset-returns").addEventListener("click", () => {
    returns = initial.slice();
    shuffled = false;
    update();
    $("game-feedback").className = "feedback";
    $("game-feedback").textContent = "Make a prediction, then shuffle.";
  });
  $("check-prediction").addEventListener("click", () => {
    const chosen = document.querySelector('input[name="shuffle-prediction"]:checked');
    const feedback = $("game-feedback");
    if (!chosen) { feedback.textContent = "Choose a prediction first."; return; }
    const correct = chosen.value === "distribution";
    feedback.className = `feedback ${correct ? "good" : "try"}`;
    feedback.textContent = correct ? "Correct. Reordering preserves the log-return histogram and sum, so the final price stays the same. Intermediate prices can change." : "Try again. A histogram counts values, not their order. The same log returns have the same sum and final price in any order.";
  });
  $("check-quiz").addEventListener("click", () => {
    const feedback = $("quiz-feedback");
    const answers = ["b", "a", "c"];
    const chosen = answers.map((_, i) => document.querySelector(`input[name="exit-q${i + 1}"]:checked`));
    if (chosen.some((item) => !item)) { feedback.textContent = "Choose one answer for each question."; return; }
    const correct = chosen.map((item, i) => item.value === answers[i]);
    feedback.className = `feedback ${correct.every(Boolean) ? "good" : "try"}`;
    feedback.textContent = correct.every(Boolean)
      ? "3 / 3. Simple returns compound, histograms discard order, and sample memory does not guarantee future forecasts."
      : `${correct.filter(Boolean).length} / 3 correct. Revisit question${correct.map((ok, i) => ok ? "" : ` ${i + 1}`).filter(Boolean).join(",")}.`;
  });
  update();
  window.A2ReturnMath = { prices: () => prices().slice(), returns: () => returns.slice() };
})();
