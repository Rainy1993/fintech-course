"""Reproduce a FinTech course figure.
Install: python -m pip install numpy pandas matplotlib scipy
For data examples, save avg_price_per_day.csv beside this script.
"""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

r = np.linspace(-30, 30, 241)
log_return = 100 * np.log1p(r / 100)
selected = 100 * (61923 / 59345 - 1)
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(r, r, color="#c87229", label="Simple return")
ax.plot(r, log_return, color="#0e8d84", label="Log return")
ax.axvline(selected, color="grey", linestyle="--", linewidth=1)
ax.scatter([selected, selected], [selected, 100*np.log1p(selected/100)],
           color=["#c87229", "#0e8d84"], zorder=3)
ax.axhline(0, color="lightgrey", linewidth=0.8)
ax.axvline(0, color="lightgrey", linewidth=0.8)
ax.set(xlabel="Simple return (%)", ylabel="Return (%)", xlim=(-30, 30))
ax.legend()

plt.tight_layout()
plt.show()
