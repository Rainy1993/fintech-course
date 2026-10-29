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

# Match the website's editable settings.
BINS = 10
BANDWIDTH = 0.70  # Percentage points; not scipy's bandwidth factor.
LAYER = "hist"  # "hist", "kde", or "normal".
low, high = np.floor(g.min() - 1), np.ceil(g.max() + 1)
edges = np.linspace(low, high, BINS + 1)
x = np.linspace(low, high, 400)
# Gaussian KDE with an absolute bandwidth in return percentage points.
z = (x[:, None] - g[None, :]) / BANDWIDTH
kde = np.exp(-z*z/2).mean(axis=1) / (BANDWIDTH*np.sqrt(2*np.pi))
mu, sd = g.mean(), g.std(ddof=1)
normal = np.exp(-0.5*((x-mu)/sd)**2) / (sd*np.sqrt(2*np.pi))
fig, ax = plt.subplots(figsize=(8, 4.5))
density = LAYER != "hist"
ax.hist(g, bins=edges, density=density, color="#7bb1d2", alpha=0.7,
        rwidth=0.98, label="Histogram")
if LAYER in ("kde", "normal"):
    ax.plot(x, kde, color="#0e8d84", label="KDE")
if LAYER == "normal":
    ax.plot(x, normal, color="#c87229", linestyle="--", label="Normal benchmark")
ax.set(xlabel="Daily log return (%)",
       ylabel="Density per percentage point" if density else "Frequency (days)")
ax.legend()

plt.tight_layout()
plt.show()
