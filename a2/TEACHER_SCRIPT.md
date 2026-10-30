# A2 · From BTC Prices to Returns

**Audience:** non-specialists. **Course language:** English. **Teaching mode:** interactive website plus the instructor's separate PDF slides. The material can be divided across 45-minute meetings.

## Learning outcomes

Students can (1) distinguish a historical daily average BTC price return from Janni's personal return; (2) calculate a simple return; (3) explain why log returns add across time; (4) distinguish a log-return histogram, KDE, and normal benchmark; (5) explain what each ACF lag measures; and (6) interpret a Ljung–Box test without equating sample autocorrelation with reliable predictability.

## Data and preparation

The source is Blockchain Research Center (https://blockchain-research-center.com), identified by the course author. The course-provided file is `data/avg_price_per_day.csv`, BTC column; a full downloadable copy is included at `../assets/data/avg_price_per_day.csv`. The story and data explorer use 93 daily averages from 7 April through 8 July 2026, giving 92 daily log returns. The course author confirms that BTC values are USD per BTC. The CSV itself does not document its source venue or averaging method, and its daily average may differ from an execution price. Crypto observations include weekends. The 03 game uses all 92 daily log returns; shuffling them creates hypothetical alternative paths.

## Python reproduction

Key data figures have a collapsed **Reproduce with Python** panel with complete source and a `.py` download. The Dataset download card also provides a ZIP containing all 12 scripts, the data, package requirements, and instructions. Examples use the initial chart settings; edit `SHUFFLE`, `BINS`, `BANDWIDTH`, `LAYER`, `MAX_LAG`, or `MODE` to explore alternatives. The scripts produce static Matplotlib figures.

## Suggested teaching flow

| Website section | Instructor question | Student takeaway |
|---|---|---|
| 01 · Janni's BTC question | After a −1.76% daily price return, can past returns help predict the next one? | First calculate returns, then study their distribution and patterns over time. A dataset average is not Janni's execution price. |
| 02 · Janni's one-day return | Assume Janni bought at the 1 July dataset average and valued it at the 2 July average. What is his illustrative price return? | `(61,045 − 59,345)/59,345 ≈ +2.865%`. His actual return depends on execution price and fees. |
| 02 · Why another measure? | What was the BTC price return from 1 to 3 July? | Replay the animated figure: prices `59,345 → 61,045 → 61,923`; daily simple returns `+2.865%` and `+1.438%`. Compound the growth factors and subtract 1 for the two-day simple price return `+4.344%`. |
| 02 · Across time | Can we find a measure that adds over time? | Daily log returns `+2.824%` and `+1.428%` sum to the two-day log return `+4.252%`. This differs from the simple return. |
| 02 · Return comparison | How does the gap change as the simple return changes? | Move the pointer along the curves; the bar below shows simple minus log in percentage points. Log returns approximate simple returns near zero; `r = exp(g) − 1` converts exactly. |
| 03 · BTC log-return shuffle lab | What happens when the same 92 daily log returns are reordered? | Their sum, final price, and 20-bin log-return histogram remain; the intermediate price path and price histogram can change. A histogram does not show time order. |
| 04 · Distribution and time order | What does each view answer? | Histogram counts observations; KDE smooths observed data; the fitted normal is a benchmark; time plots retain order. |
| 04 · Autocorrelation and ACF | Does yesterday’s BTC log return offer a linear clue? | The Time order carousel first shows 91 observed yesterday–today pairs as a scatter, then all 92 returns in order. The ACF shows the sample correlation across lags; lag 1 is about 0.40 with the standard whole-sample definition. |
| 04 · Ljung–Box test | Is the sample compatible with no linear autocorrelation through a selected lag? | The joint test uses the selected lags. At lag 10, Q ≈ 19.87 and p ≈ 0.030: reject the no-autocorrelation null at 5% for this sample. This does not establish useful future forecasts. |
| 04 · Simulated time patterns | What do positive, zero, and negative short-run dependence look like? | Compare time plots and ACFs for pink-like persistence, white no linear memory, and blue-like alternation. Color labels are analogies, not BTC classifications. |
| 05 · Exit ticket | How do returns combine, what does a histogram preserve, and what does sample autocorrelation establish? | Simple returns compound while log returns add; a histogram discards order; sample linear memory requires separate future validation. |

## Important numbers

- 1 July: `USD 59,345`; 2 July: `USD 61,045`; 3 July: `USD 61,923` (BTC daily averages in the course CSV).
- 1→2 July simple return: `+2.865%`; log return: `+2.824%`. Two-day simple BTC price return: `+4.344%`; two-day log return: `+4.252%`.
- From 03 onward, every plotted or simulated return is a **log return**. The game reconstructs prices via `P_t=P_(t−1) exp(g_t)`; the website leaves that formula implicit here. The 03 return histogram uses 20 bins spanning −6% to +6%, covering all 92 returns in this sample.
- In 04, students choose the histogram bin count first. Adding KDE fixes that bin count and replaces the bin control with a bandwidth slider (0.25–2.00 percentage points); the normal-benchmark view retains the same histogram and KDE settings. View 1's vertical axis is frequency (days). Views 2 and 3 use density per percentage point, with histogram bar height equal to count divided by `92 × bin width`; bar area represents the observed share in the bin. An empty bin has no observations in this sample, but does not imply that future returns in that range are impossible.
- The main color explorer compares three simulated AR(1)-style time patterns using their time plots and ACFs. Pink-like and blue-like are analogies, not strict spectral classifications. The spectrum explanation is optional.
- This BTC window has a positive lag-1 sample ACF and a significant Ljung–Box result through lag 10; do not call it white noise. Lack of detectable linear autocorrelation in another sample would only be compatible with white noise, not proof of independence. Test results do not establish stable predictability.

## Sources

- Course-provided `data/avg_price_per_day.csv`, BTC column; [download the 93-day extract](../assets/data/btc_daily_average_2026-04-07_2026-07-08.csv).
- Huang, C., & Petukhina, A. (2022). *Applied Time Series Analysis and Forecasting with Python*. Statistics and Computing. Springer, Cham. https://doi.org/10.1007/978-3-031-13584-2. ISBN 978-3-031-13584-2. See p. 26 for log returns and §1.3.3 for sample ACF.
- [NIST autocorrelation definition](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35c.htm) and [NIST Box–Ljung test](https://itl.nist.gov/div898/handbook/pmc/section4/pmc4481.htm) for the whole-sample ACF estimator and joint test statistic.
- [Chris Brooks, *Introductory Econometrics for Finance*, Box 1.3](https://assets.cambridge.org/97811070/34662/excerpt/9781107034662_excerpt.pdf): log returns are time additive.
- [Columbia University notes on colored noise](https://www.ee.columbia.edu/~dpwe/noise/) for the optional signal analogy.
