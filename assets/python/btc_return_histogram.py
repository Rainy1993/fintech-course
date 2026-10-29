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

SHUFFLE = False  # Change to True to explore a reordered path.
SEED = 42
if SHUFFLE:
    g = np.random.default_rng(SEED).permutation(g)
path = prices[0] * np.exp(np.r_[0, np.cumsum(g / 100)])

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(g, bins=np.linspace(-6, 6, 21), color="#0e8d84", rwidth=0.95)
ax.set(xlabel="Daily log return (%)", ylabel="Frequency (days)",
       title="BTC log-return distribution")

plt.tight_layout()
plt.show()
