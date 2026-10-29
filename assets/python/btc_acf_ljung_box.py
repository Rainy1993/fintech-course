"""Reproduce a FinTech course figure.
Install: python -m pip install numpy pandas matplotlib scipy
For data examples, save avg_price_per_day.csv beside this script.
"""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Read the same 93 BTC prices used by the website.
data_file = Path(__file__).with_name("avg_price_per_day.csv")
if not data_file.exists():
    data_file = Path(__file__).resolve().parent.parent / "data/avg_price_per_day.csv"
data = pd.read_csv(data_file, usecols=["Date", "BTC"], parse_dates=["Date"])
data = data.loc[data["Date"].between("2026-04-07", "2026-07-08")].sort_values("Date")
prices = data["BTC"].to_numpy(dtype=float)
dates = data["Date"].to_numpy()
g = 100 * np.diff(np.log(prices))  # Log returns in percentage points.

from scipy.stats import chi2

MAX_LAG = 1  # Choose from 1 to 12, as on the website.
n = len(g)
centered = g - g.mean()
# Whole-sample denominator: same ACF estimator as the website and NIST.
acf = np.array([centered[k:] @ centered[:-k] / (centered @ centered)
                for k in range(1, MAX_LAG + 1)])
lags = np.arange(1, MAX_LAG + 1)
q = n * (n + 2) * np.sum(acf**2 / (n - lags))
p_value = chi2.sf(q, df=MAX_LAG)  # No fitted ARMA parameters here.
fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(lags, acf, color="#2167a0")
guide = 1.96 / np.sqrt(n)
ax.axhline(0, color="grey", linewidth=0.8)
for bound in [-guide, guide]:
    ax.axhline(bound, color="#b6a46b", linestyle="--")
ax.set(xlabel="Lag (calendar days)", ylabel="ACF", xticks=lags)
print(f"n = {n}; lag-1 ACF = {acf[0]:.3f}")
print(f"Ljung–Box through lag {MAX_LAG}: Q = {q:.2f}; p = {p_value:.4f}")

plt.tight_layout()
plt.show()
