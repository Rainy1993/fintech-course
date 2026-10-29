(function () {
  "use strict";
  const rows = window.A2BTC;
  const values = rows.slice(1).map((r, i) => 100 * Math.log(r.price / rows[i].price));
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((a, x) => a + (x - mean) ** 2, 0) / (n - 1));
  let bandwidth = Number(document.getElementById("kde-bandwidth").value);
  let selectedBins = Number(document.getElementById("bin-count").value);
  const low = Math.floor(Math.min(...values) - 1), high = Math.ceil(Math.max(...values) + 1);
  const el = (id) => document.getElementById(id);
  const t = (x, y, s, anchor = "middle") => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#52697d" font-size="16" font-family="Arial,sans-serif">${s}</text>`;
  const line = (x1, y1, x2, y2, color = "#a8b7c2", width = 1.5) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
  const gaussian = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const kde = (x) => values.reduce((sum, v) => sum + gaussian((x - v) / bandwidth), 0) / (n * bandwidth);
  const normal = (x) => gaussian((x - mean) / sd) / sd;
  const X = (v, a = low, b = high, l = 65, r = 720) => l + (v - a) / (b - a) * (r - l);
  const Y = (v, max, top = 25, bottom = 275) => bottom - v / max * (bottom - top);
  let layer = "hist";
  function curve(fn, ymax) {
    const pts = Array.from({ length: 180 }, (_, i) => { const x = low + i / 179 * (high - low); return `${X(x).toFixed(1)},${Y(fn(x), ymax).toFixed(1)}`; });
    return pts.join(" ");
  }
  function drawDistribution() {
    const binCount = selectedBins, width = (high - low) / binCount;
    const counts = Array(binCount).fill(0);
    values.forEach((v) => { counts[Math.min(binCount - 1, Math.floor((v - low) / width))]++; });
    const density = layer !== "hist";
    const maxCount = Math.max(...counts);
    const narrowKde = (x) => values.reduce((sum, v) => sum + gaussian((x - v) / 0.25), 0) / (n * 0.25);
    const densityMax = Math.max(...Array.from({ length: 180 }, (_, i) => { const x = low + i / 179 * (high - low); return Math.max(narrowKde(x), normal(x)); }));
    const rawMax = density ? Math.max(maxCount / (n * width), densityMax) * 1.1 : maxCount;
    const ymax = density ? Math.ceil(rawMax * 10) / 10 : Math.ceil(rawMax / 5) * 5;
    let markup = line(65, 25, 65, 275) + line(65, 275, 720, 275);
    counts.forEach((count, i) => {
      const left = X(low + i * width), right = X(low + (i + 1) * width);
      const height = density ? count / (n * width) : count;
      const yy = Y(height, ymax);
      markup += `<rect x="${left + 1}" y="${yy}" width="${Math.max(1, right - left - 2)}" height="${275 - yy}" fill="#7bb1d2" opacity=".72"><title>${(low + i * width).toFixed(1)}% to ${(low + (i + 1) * width).toFixed(1)}%: ${count} days${density ? `; density ${(count / (n * width)).toFixed(3)} per percentage point` : ""}</title></rect>`;
    });
    if (layer !== "hist") markup += `<polyline points="${curve(kde, ymax)}" fill="none" stroke="#0e8d84" stroke-width="4"/>`;
    if (layer === "normal") markup += `<polyline points="${curve(normal, ymax)}" fill="none" stroke="#c87229" stroke-width="4"/>`;
    markup += t(65, 17, density ? "Density (per percentage point)" : "Frequency (days)", "start") + t(57, 30, density ? ymax.toFixed(1) : ymax, "end") + t(57, 278, "0", "end") + t(65, 302, `${low}%`) + t(720, 302, `${high}%`) + t(395, 329, "Daily log return (%)");
    if (layer !== "hist") markup += `<circle cx="490" cy="37" r="5" fill="#0e8d84"/>${t(503, 42, "KDE", "start")}`;
    if (layer === "normal") markup += `<circle cx="592" cy="37" r="5" fill="#c87229"/>${t(605, 42, "Normal", "start")}`;
    el("distribution-plot").innerHTML = markup;
    el("distribution-plot").setAttribute("aria-label", `Histogram of ${n} BTC daily log returns with ${binCount} bins${layer === "hist" ? "; vertical axis shows frequency in days" : layer === "kde" ? " and KDE; vertical axis shows density per percentage point" : " and KDE and fitted normal curve; vertical axis shows density per percentage point"}.`);
    el("bin-value").textContent = binCount;
    el("fixed-bin-value").textContent = binCount;
    el("bandwidth-value").textContent = bandwidth.toFixed(2);
    if (layer === "hist") {
      el("distribution-explainer").innerHTML = "<div><strong>Definition:</strong> A histogram counts observations within equal-width return ranges called bins.</div><div><strong>Advantage:</strong> Shows which return ranges occurred most often in the observed period.</div><div><strong>Bins:</strong> Too few can hide detail; too many can produce a jagged picture with empty bins.</div><div><strong>Limitation:</strong> An empty bin means no return fell in that range in this sample—not that a future return cannot.</div>";
    } else {
      el("distribution-explainer").innerHTML = layer === "kde" ? "<div><strong>Definition:</strong> KDE places a smooth curve around each observed return and combines them into an estimated density.</div><div><strong>Advantage:</strong> Makes the overall shape easier to see without choosing histogram bins.</div><div><strong>Bandwidth:</strong> More smoothing can hide features; less smoothing can make random bumps look meaningful.</div><div><strong>Limitation:</strong> The curve is an estimate from past data—not the true distribution or a guarantee about tomorrow.</div>" : "Normal benchmark: a bell curve using this sample's mean and standard deviation. Compare its shape with the data-based KDE.";
    }
  }
  function drawBars(id, data, label, square = false) {
    const svg = el(id), maxAbs = Math.max(...data.map(Math.abs));
    const baseline = square ? 237 : 133;
    const scale = square ? 185 / maxAbs : 103 / maxAbs;
    let markup = line(65, 28, 65, 237) + line(65, baseline, 720, baseline);
    data.forEach((v, i) => {
      const x = 67 + i * (650 / data.length), h = Math.max(1, Math.abs(v) * scale), y = v >= 0 ? baseline - h : baseline;
      markup += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(2, 650 / data.length - 1.5).toFixed(1)}" height="${h.toFixed(1)}" fill="${square ? "#7d6aae" : v >= 0 ? "#0e8d84" : "#c87229"}"><title>${rows[i + 1].date}: ${square ? `${v.toFixed(2)} squared percentage points` : `${v >= 0 ? "+" : ""}${v.toFixed(2)}% log return`}</title></rect>`;
    });
    markup += t(65, 261, "8 Apr") + t(720, 261, "8 Jul") + t(375, 261, "Calendar days") + t(18, 38, square ? "g²" : "g (%)", "start");
    svg.innerHTML = markup;
    svg.setAttribute("aria-label", label);
  }
  const sampleCorrelation = (series, lag) => {
    const left = series.slice(0, -lag), right = series.slice(lag);
    const a = left.reduce((s, v) => s + v, 0) / left.length;
    const b = right.reduce((s, v) => s + v, 0) / right.length;
    const numerator = left.reduce((s, v, i) => s + (v - a) * (right[i] - b), 0);
    const va = left.reduce((s, v) => s + (v - a) ** 2, 0);
    const vb = right.reduce((s, v) => s + (v - b) ** 2, 0);
    return numerator / Math.sqrt(va * vb);
  };
  let timeSlide = 0, previewPairs = values.length - 1, previewAnimation = null;
  const lagPairs = values.slice(0, -1).map((previous, i) => [previous, values[i + 1]]);
  const lagXMean = lagPairs.reduce((sum, pair) => sum + pair[0], 0) / lagPairs.length;
  const lagYMean = lagPairs.reduce((sum, pair) => sum + pair[1], 0) / lagPairs.length;
  const lagSlope = lagPairs.reduce((sum, pair) => sum + (pair[0] - lagXMean) * (pair[1] - lagYMean), 0) /
    lagPairs.reduce((sum, pair) => sum + (pair[0] - lagXMean) ** 2, 0);
  const lagIntercept = lagYMean - lagSlope * lagXMean;
  function drawTimePreview() {
    const maxAbs = Math.ceil(Math.max(...values.map(Math.abs)) + 1);
    const left = 230, right = 530, top = 35, bottom = 335;
    const x = (v) => left + (v + maxAbs) / (2 * maxAbs) * (right - left);
    const y = (v) => bottom - (v + maxAbs) / (2 * maxAbs) * (bottom - top);
    let markup = line(left, top, left, bottom) + line(left, bottom, right, bottom) + line(x(0), top, x(0), bottom, '#ccd7de') + line(left, y(0), right, y(0), '#ccd7de');
    const tickStep = maxAbs <= 5 ? 1 : 2;
    for (let value = -Math.floor(maxAbs / tickStep) * tickStep; value <= maxAbs; value += tickStep) {
      markup += line(x(value), bottom, x(value), bottom + 6) + t(x(value), bottom + 25, `${value}%`);
      markup += line(left - 6, y(value), left, y(value)) + t(left - 12, y(value) + 5, `${value}%`, 'end');
    }
    if (previewPairs === lagPairs.length) {
      markup += `<path d="M${x(-maxAbs).toFixed(1)} ${y(lagIntercept - lagSlope * maxAbs).toFixed(1)} L${x(maxAbs).toFixed(1)} ${y(lagIntercept + lagSlope * maxAbs).toFixed(1)}" stroke="#c06a32" stroke-width="3" fill="none"><title>Least-squares line fitted to all ${lagPairs.length} observed yesterday–today pairs</title></path>`;
      markup += t(715, 28, `Linear fit · ${lagPairs.length} pairs`, 'end');
    }
    for (let i = 1; i <= previewPairs; i++) {
      const latest = i === previewPairs;
      markup += `<circle cx="${x(values[i - 1]).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="${latest ? 6 : 4}" fill="${latest ? '#d95b31' : '#2167a0'}" opacity="${latest ? 1 : .62}"><title>${rows[i].date} → ${rows[i + 1].date}: yesterday ${values[i - 1].toFixed(2)}%, today ${values[i].toFixed(2)}%</title></circle>`;
    }
    markup += t((left + right) / 2, 380, "Yesterday's log return (%)") + t(25, 28, "Today's log return (%)", 'start');
    el('time-lag-preview').innerHTML = markup;
    el('time-lag-preview').setAttribute('aria-label', `${previewPairs} of ${values.length - 1} observed BTC yesterday–today log-return pairs shown as dots.${previewPairs === lagPairs.length ? ` Linear regression line fitted to all ${lagPairs.length} pairs.` : ''}`);
    el('time-preview-progress').value = String(previewPairs);
    el('time-preview-count').textContent = `${previewPairs} / ${values.length - 1}`;
  }
  function stopTimePreview() {
    if (previewAnimation) clearInterval(previewAnimation);
    previewAnimation = null;
    el('time-preview-play').textContent = '▶ Replay pairs';
  }
  function playTimePreview() {
    if (previewAnimation) { stopTimePreview(); return; }
    previewPairs = 0;
    drawTimePreview();
    el('time-preview-play').textContent = 'Pause';
    previewAnimation = setInterval(() => {
      previewPairs = Math.min(values.length - 1, previewPairs + 1);
      drawTimePreview();
      if (previewPairs >= values.length - 1) stopTimePreview();
    }, 65);
  }
  function showTimeSlide(index) {
    timeSlide = Math.max(0, Math.min(1, index));
    el('time-plot').toggleAttribute('hidden', timeSlide !== 1);
    el('time-lag-preview').toggleAttribute('hidden', timeSlide !== 0);
    el('python-time-scatter').hidden = timeSlide !== 0;
    el('python-time-series').hidden = timeSlide !== 1;
    el('time-preview-controls').hidden = timeSlide !== 0;
    el('time-slide-title').textContent = timeSlide === 0 ? 'Yesterday → today · observed BTC log returns' : 'Time order · BTC daily log returns';
    el('time-slide-count').textContent = `${timeSlide + 1} / 2`;
    el('time-previous').disabled = timeSlide === 0;
    el('time-next').disabled = timeSlide === 1;
    el('time-slide-picture').setAttribute('aria-label', timeSlide === 0 ? 'Show daily log-return sequence' : 'Show yesterday–today scatter');
    if (timeSlide === 0) playTimePreview(); else stopTimePreview();
  }
  let swipeStart = null, skipSwipeClick = false;
  el('time-slide-picture').addEventListener('pointerdown', (event) => { if (event.pointerType === 'touch') swipeStart = event.clientX; });
  el('time-slide-picture').addEventListener('pointerup', (event) => {
    if (swipeStart === null) return;
    const distance = event.clientX - swipeStart;
    swipeStart = null;
    if (Math.abs(distance) > 45) {
      skipSwipeClick = true;
      showTimeSlide(distance < 0 ? 1 : 0);
      setTimeout(() => { skipSwipeClick = false; }, 0);
    }
  });
  el('time-slide-picture').addEventListener('pointercancel', () => { swipeStart = null; });
  el('time-slide-picture').addEventListener('click', () => {
    if (skipSwipeClick) { skipSwipeClick = false; return; }
    showTimeSlide(1 - timeSlide);
  });
  el('time-previous').addEventListener('click', () => showTimeSlide(0));
  el('time-next').addEventListener('click', () => showTimeSlide(1));
  el('time-slide-picture').addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showTimeSlide(event.key === 'ArrowLeft' ? 0 : 1);
    }
  });
  el('time-preview-play').addEventListener('click', playTimePreview);
  el('time-preview-progress').addEventListener('input', () => {
    stopTimePreview();
    previewPairs = Number(el('time-preview-progress').value);
    drawTimePreview();
  });
  drawTimePreview();
  const sampleACF = (series, lag) => {
    const average = series.reduce((sum, value) => sum + value, 0) / series.length;
    const denominator = series.reduce((sum, value) => sum + (value - average) ** 2, 0);
    let numerator = 0;
    for (let i = lag; i < series.length; i++) numerator += (series[i] - average) * (series[i - lag] - average);
    return numerator / denominator;
  };
  const acfValues = Array.from({ length: 12 }, (_, i) => sampleACF(values, i + 1));
  function erfcApprox(z) {
    const t = 1 / (1 + 0.3275911 * z);
    return t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-z * z);
  }
  function chiSquareTail(statistic, degrees) {
    const x = statistic / 2;
    if (degrees % 2 === 0) {
      let term = 1, sum = 1;
      for (let k = 1; k < degrees / 2; k++) { term *= x / k; sum += term; }
      return Math.min(1, Math.exp(-x) * sum);
    }
    let tail = erfcApprox(Math.sqrt(x));
    let gamma = Math.sqrt(Math.PI);
    for (let shape = 0.5; shape < degrees / 2; shape++) {
      gamma *= shape;
      tail += Math.pow(x, shape) * Math.exp(-x) / gamma;
    }
    return Math.min(1, Math.max(0, tail));
  }
  let acfAnimation = null;
  function stopACFAnimation() {
    if (acfAnimation) clearInterval(acfAnimation);
    acfAnimation = null;
    el('acf-play').textContent = '▶ Build ACF';
  }
  function drawACF() {
    const selected = Number(el('acf-lag').value);
    const x = (i) => 95 + i * 52;
    const guide = 1.96 / Math.sqrt(values.length);
    const extent = Math.max(0.5, Math.ceil((Math.max(...acfValues.map(Math.abs), guide) + 0.05) * 10) / 10);
    const center = 160, scale = 115 / extent;
    let markup = line(68, 45, 68, 275) + line(68, center, 720, center, '#879ba8', 2);
    for (let tick = -Math.floor(extent * 5); tick <= Math.floor(extent * 5); tick++) {
      const value = tick * 0.2, yy = center - value * scale;
      markup += line(62, yy, 68, yy) + t(55, yy + 5, value === 0 ? '0' : value.toFixed(1), 'end');
    }
    markup += `<path d="M68 ${center - guide * scale}H720 M68 ${center + guide * scale}H720" stroke="#b6a46b" stroke-dasharray="6 5" fill="none"/>`;
    acfValues.forEach((v, i) => {
      const h = Math.abs(v) * scale;
      const yy = v >= 0 ? center - h : center;
      if (i < selected) markup += `<rect x="${x(i)}" y="${yy.toFixed(1)}" width="28" height="${Math.max(2, h).toFixed(1)}" rx="3" fill="${i + 1 === selected ? '#d95b31' : '#2167a0'}"><title>Lag ${i + 1}: sample autocorrelation ${v.toFixed(3)}</title></rect>`;
      else markup += `<rect x="${x(i)}" y="${center - 2}" width="28" height="4" rx="2" fill="#d9e1df"/>`;
      markup += t(x(i) + 14, 307, i + 1);
    });
    markup += t(68, 25, 'ACF', 'start') + t(380, 328, 'Lag · calendar days');
    el('acf-plot').innerHTML = markup;
    el('acf-plot').setAttribute('aria-label', `Sample ACF for 92 BTC daily log returns. Lags 1 through ${selected} shown; lag ${selected} autocorrelation ${acfValues[selected - 1].toFixed(2)}. Dashed visual guide plus or minus ${guide.toFixed(2)}.`);
    el('acf-lag-value').textContent = selected;
    el('acf-pair-readout').textContent = selected === 1 ? 'Lag 1 · yesterday → today' : `Lag ${selected} · ${selected} calendar days apart`;
    let statistic = 0;
    for (let k = 1; k <= selected; k++) statistic += acfValues[k - 1] ** 2 / (values.length - k);
    statistic *= values.length * (values.length + 2);
    const p = chiSquareTail(statistic, selected);
    el('lb-lag-value').textContent = selected;
    el('lb-q').textContent = statistic.toFixed(2);
    el('lb-p').textContent = p < 0.001 ? p.toExponential(2) : p.toFixed(3);
    el('lb-interpretation').textContent = p < 0.05 ? 'At 5%: evidence of autocorrelation across the selected lags.' : 'At 5%: no clear evidence of autocorrelation across the selected lags.';
    el('white-noise-conclusion').innerHTML = `<strong>Takeaway:</strong> lag-1 ACF ≈ ${acfValues[0].toFixed(2)}: yesterday’s return carries a linear clue about today’s return in this sample. This is <strong>linear memory</strong>—past values relate to later values. If the pattern persists, past returns may help predict the next return; this sample alone cannot establish that. <a href="https://online.stat.psu.edu/stat510/Lesson01" target="_blank" rel="noopener">Penn State · Time Series Basics</a>`;
  }
  el('acf-play').addEventListener('click', () => {
    if (acfAnimation) { stopACFAnimation(); return; }
    el('acf-lag').value = '1';
    drawACF();
    el('acf-play').textContent = 'Pause';
    acfAnimation = setInterval(() => {
      const next = Math.min(12, Number(el('acf-lag').value) + 1);
      el('acf-lag').value = String(next);
      drawACF();
      if (next === 12) stopACFAnimation();
    }, 420);
  });
  el('acf-lag').addEventListener('input', () => { stopACFAnimation(); drawACF(); });
  drawACF();
  let seed = 6417;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return (seed / 4294967296) * 2 - 1; };
  const innovations = Array.from({length: 160}, random);
  const patternModes = { pink: {phi: .72, color: '#bc7796', label: 'Pink-like persistence', note: 'A positive AR(1) creates short-run persistence. It is not automatically strict pink noise.'}, white: {phi: 0, color: '#657c87', label: 'White: no linear memory', note: 'Independent simulated shocks have no systematic linear relationship across days.'}, blue: {phi: -.72, color: '#447fb2', label: 'Blue-like alternation', note: 'A negative AR(1) tends to alternate in sign. It is not automatically strict blue noise.'} };
  const patternSeries = Object.fromEntries(Object.entries(patternModes).map(([key, mode]) => { const out = []; innovations.forEach((e, i) => out.push(e + (i ? mode.phi * out[i - 1] : 0))); return [key, out]; }));
  function drawPattern(modeKey) {
    const mode = patternModes[modeKey], series = patternSeries[modeKey];
    const maxAbs = 3.1, xx = i => 65 + i * 650 / (series.length - 1), yy = v => 155 - v / maxAbs * 105;
    const points = series.map((v, i) => `${xx(i).toFixed(1)},${yy(v).toFixed(1)}`).join(' ');
    let timeAxes = line(65, 40, 65, 275) + line(65, 275, 720, 275) + line(65, 155, 720, 155, '#aab9c0');
    for (const value of [-2, 0, 2]) {
      const tickY = yy(value);
      timeAxes += line(59, tickY, 65, tickY) + t(52, tickY + 5, value, 'end');
    }
    for (const day of [1, 40, 80, 120, 160]) {
      const tickX = xx(day - 1);
      timeAxes += line(tickX, 275, tickX, 281) + t(tickX, 305, day);
    }
    el('pattern-time').innerHTML = timeAxes + `<polyline points="${points}" fill="none" stroke="${mode.color}" stroke-width="2.3"/>` + t(65, 25, 'Signal', 'start') + t(375, 325, 'Simulated day');
    const center = 158, scale = 115;
    let acf = line(65, 43, 65, 273) + line(65, center, 720, center, '#879ba8', 2);
    for (const value of [-1, -0.5, 0, 0.5, 1]) {
      const tickY = center - value * scale;
      acf += line(59, tickY, 65, tickY) + t(52, tickY + 5, value === 0 ? '0' : value.toFixed(1), 'end');
    }
    for (let lag = 1; lag <= 10; lag++) { const c = sampleCorrelation(series, lag); const h = Math.abs(c) * scale; acf += `<rect x="${90 + (lag - 1) * 58}" y="${(c >= 0 ? center - h : center).toFixed(1)}" width="29" height="${Math.max(2,h).toFixed(1)}" fill="${mode.color}"><title>Lag ${lag}: ${c.toFixed(2)}</title></rect>` + t(104 + (lag - 1) * 58, 305, lag); }
    el('pattern-acf').innerHTML = acf + t(370, 325, 'Lag · simulated days') + t(65, 25, 'ACF', 'start');
    el('pattern-time').setAttribute('aria-label', `${mode.label} simulated time sequence.`);
    el('pattern-acf').setAttribute('aria-label', `Sample ACF for ${mode.label.toLowerCase()}; ${mode.note}`);
    el('pattern-explainer').textContent = mode.note;
    document.querySelectorAll('[data-pattern]').forEach(button => button.classList.toggle('selected', button.dataset.pattern === modeKey));
  }
  document.querySelectorAll('[data-pattern]').forEach(button => button.addEventListener('click', () => drawPattern(button.dataset.pattern)));
  drawPattern('white');
  const noiseModes = {
    pink: { name: "Pink noise", clue: "Slow variation carries more power", color: "#bc7796", weight: (k) => 1 / k },
    white: { name: "White noise", clue: "No frequency band is favored", color: "#748992", weight: () => 1 },
    blue: { name: "Blue noise", clue: "Fast variation carries more power", color: "#447fb2", weight: (k) => k }
  };
  const harmonics = Array.from({ length: 60 }, (_, i) => i + 1);
  const phases = harmonics.map((k) => (k * k * 1.61803398875) % (2 * Math.PI));
  const sampleCount = 300;
  const makeSignal = (choice) => {
    const weights = harmonics.map(choice.weight);
    const parts = [0, 1, 2].map((band) => Array.from({ length: sampleCount }, (_, j) => harmonics.slice(band * 20, band * 20 + 20).reduce((total, k) => total + Math.sqrt(weights[k - 1]) * Math.sin(2 * Math.PI * k * j / sampleCount + phases[k - 1]), 0)));
    const raw = Array.from({ length: sampleCount }, (_, j) => parts[0][j] + parts[1][j] + parts[2][j]);
    const rms = Math.sqrt(raw.reduce((sum, v) => sum + v * v, 0) / sampleCount);
    return { weights, normalized: raw.map((v) => v / rms), parts: parts.map((part) => part.map((v) => v / rms)) };
  };
  const signals = Object.fromEntries(Object.entries(noiseModes).map(([mode, choice]) => [mode, makeSignal(choice)]));
  function drawNoise(mode) {
    const choice = noiseModes[mode];
    const order = ["pink", "white", "blue"];
    const rows = order.map((key, row) => {
      const center = 66 + row * 120;
      const selected = key === mode;
      const y = (v) => center - Math.max(-3.3, Math.min(3.3, v)) * 12.5;
      const points = signals[key].normalized.map((v, i) => `${(124 + i * 590 / (sampleCount - 1)).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
      return `<rect x="13" y="${center - 51}" width="730" height="102" rx="8" fill="${selected ? "#eff4f1" : "#f8f9f7"}" stroke="${selected ? choice.color : "#e1e6e1"}" stroke-width="${selected ? 2 : 1}"/><path d="M124 ${center}H714" stroke="#d9dfda" stroke-width="1"/><text x="28" y="${center + 6}" fill="${noiseModes[key].color}" font-family="Arial,sans-serif" font-size="20" font-weight="700">${noiseModes[key].name.split(" ")[0]}</text><polyline points="${points}" fill="none" stroke="${noiseModes[key].color}" stroke-width="${selected ? 2.4 : 1.8}" opacity="${selected ? 1 : .82}" stroke-linejoin="round" stroke-linecap="round"/>`;
    }).join("");
    el("noise-trace").innerHTML = rows;
    el("noise-trace").setAttribute("aria-label", `Three same-scale illustrative signals over time: pink has slower swings, white has mixed frequencies, blue has faster flicker. ${choice.name} selected.`);
    const weights = signals[mode].weights;
    const bands = [0, 1, 2].map((j) => weights.slice(j * 20, j * 20 + 20).reduce((a, b) => a + b, 0));
    const peak = Math.max(...bands);
    const componentRows = ["Slow", "Middle", "Fast"].map((label, band) => {
      const center = 72 + band * 98;
      const points = signals[mode].parts[band].map((v, i) => `${(128 + i * 430 / (sampleCount - 1)).toFixed(1)},${(center - Math.max(-2.6, Math.min(2.6, v)) * 13).toFixed(1)}`).join(" ");
      const powerWidth = Math.max(3, Math.round(bands[band] / peak * 120));
      return `<rect x="11" y="${center - 44}" width="738" height="88" rx="7" fill="#f8f9f7" stroke="#e1e6e1"/><text x="27" y="${center + 7}" fill="#40544a" font-size="19" font-weight="700" font-family="Arial,sans-serif">${label}</text><path d="M128 ${center}H558" stroke="#d9dfda"/><polyline points="${points}" fill="none" stroke="${choice.color}" stroke-width="2.3" stroke-linejoin="round"/><rect x="606" y="${center - 12}" width="120" height="24" rx="2" fill="#e8ece9"/><rect x="606" y="${center - 12}" width="${powerWidth}" height="24" rx="2" fill="${choice.color}"/>`;
    }).join("");
    el("noise-components").innerHTML = `<text x="606" y="20" fill="#697770" font-size="14" font-weight="700" font-family="Arial,sans-serif">POWER</text>${componentRows}`;
    el("noise-components").setAttribute("aria-label", `${choice.name} decomposed into slow, middle, and fast frequency bands. Their waveforms and power bars correspond by row. Relative powers: ${bands.map((v) => Math.round(v / peak * 100)).join(", ")} percent of the tallest bar.`);
    el("noise-recipe").textContent = `Slow + middle + fast = the ${choice.name.toLowerCase()} signal above`;
    el("noise-name").textContent = choice.name;
    el("noise-clue").textContent = choice.clue;
    document.querySelectorAll("[data-noise]").forEach((button) => button.classList.toggle("selected", button.dataset.noise === mode));
  }
  document.querySelectorAll("[data-layer]").forEach((button) => button.addEventListener("click", () => {
    layer = button.dataset.layer;
    el("bin-control").hidden = layer !== "hist";
    el("bandwidth-control").hidden = layer === "hist";
    document.querySelectorAll("[data-layer]").forEach((b) => b.classList.toggle("selected", b === button));
    drawDistribution();
  }));
  el("bin-count").addEventListener("input", () => { selectedBins = Number(el("bin-count").value); drawDistribution(); });
  el("kde-bandwidth").addEventListener("input", () => { bandwidth = Number(el("kde-bandwidth").value); drawDistribution(); });
  drawDistribution();
  drawBars("time-plot", values, "92 daily BTC log returns from 8 April to 8 July 2026.");
  document.querySelectorAll("[data-noise]").forEach((button) => button.addEventListener("click", () => drawNoise(button.dataset.noise)));
  drawNoise("white");
  window.A2BTCLogReturns = values.slice();
})();
