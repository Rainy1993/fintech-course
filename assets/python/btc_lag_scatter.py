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

x, y = g[:-1], g[1:]  # 91 observed yesterday–today pairs.
slope, intercept = np.polyfit(x, y, 1)  # OLS with an intercept.
limit = np.ceil(np.max(np.abs(g)) + 1)
line_x = np.array([-limit, limit])
fig, ax = plt.subplots(figsize=(6, 6))
ax.scatter(x, y, color="#2167a0", alpha=0.65)
ax.scatter(x[-1], y[-1], color="#d95b31", zorder=3)
ax.plot(line_x, intercept + slope*line_x, color="#c06a32", label="Linear fit")
ax.axhline(0, color="lightgrey", linewidth=0.8)
ax.axvline(0, color="lightgrey", linewidth=0.8)
ax.set(xlabel="Yesterday's log return (%)", ylabel="Today's log return (%)",
       xlim=(-limit, limit), ylim=(-limit, limit))
ax.set_aspect("equal", adjustable="box")
ax.legend()
print(f"OLS slope = {slope:.3f}; intercept = {intercept:.3f} percentage points")

plt.tight_layout()
plt.show()
