"""Reproduce a FinTech course figure.
Install: python -m pip install numpy pandas matplotlib scipy
For data examples, save avg_price_per_day.csv beside this script.
"""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Reproduce the website's exact deterministic teaching sequences.
MODE = "white"  # "pink", "white", or "blue".
phi = {"pink": 0.72, "white": 0.0, "blue": -0.72}[MODE]
color = {"pink": "#bc7796", "white": "#657c87", "blue": "#447fb2"}[MODE]
seed = 6417
shocks = []
for _ in range(160):
    seed = (1664525 * seed + 1013904223) % 2**32
    shocks.append(2 * seed / 2**32 - 1)
series = np.zeros(160)
for t, shock in enumerate(shocks):
    series[t] = shock + (phi * series[t-1] if t else 0)


fig, ax = plt.subplots(figsize=(8, 3.5))
ax.plot(np.arange(1, 161), series, color=color)
ax.axhline(0, color="grey", linewidth=0.8)
ax.set(xlabel="Simulated day", ylabel="Signal", ylim=(-3.1, 3.1),
       title=f"{MODE.capitalize()} teaching sequence")

plt.tight_layout()
plt.show()
