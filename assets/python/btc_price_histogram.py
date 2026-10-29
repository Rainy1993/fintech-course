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

# The website histogram uses the 92 prices after the starting price.
values = path[1:]
low = np.floor(values.min() / 5000) * 5000
high = np.ceil(values.max() / 5000) * 5000
fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(values, bins=np.linspace(low, high, 19), color="#2167a0", rwidth=0.95)
ax.set(xlabel="BTC price (USD)", ylabel="Frequency (days)",
       title="BTC price distribution")

plt.tight_layout()
plt.show()
