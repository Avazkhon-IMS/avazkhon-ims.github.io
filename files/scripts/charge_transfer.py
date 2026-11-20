#!/usr/bin/env python3
"""Plane-averaged charge-density difference and the charge transferred across the interface.

    python3 charge_transfer.py  P.drho.dat  P.scf.in  [--n-oxide 27] [--plot P_drho.png]

P.drho.dat : average.x output for  rho(interface) - rho(TiO2 alone) - rho(MXene alone)
             (columns: z in bohr, planar average in e/bohr^3, macroscopic average)
P.scf.in   : the interface scf input (cell, positions; atoms 1..n_oxide = TiO2)

Delta_Q(z) = A * integral of Delta_rho from the middle of the vacuum up to z  (electrons).
At the interface plane (midway between the facing atomic planes of the two slabs)
Delta_Q tells how many electrons the slab below the plane gained (> 0) or lost (< 0).
"""
import argparse, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_dipole_scf import card_index, get_value, cell_angstrom

BOHR = 0.529177210903
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('dat'); ap.add_argument('scf_in')
ap.add_argument('--n-oxide', type=int, default=27)
ap.add_argument('--plot', default='')
a = ap.parse_args()

L = open(a.scf_in).read().splitlines()
nat = int(get_value(L, 'nat')); C = cell_angstrom(L); lz = np.linalg.norm(C[2])
area = np.linalg.norm(np.cross(C[0], C[1]))                     # A^2
ip = card_index(L, 'ATOMIC_POSITIONS'); hdr = L[ip].lower()
P = np.array([[float(v) for v in l.split()[1:4]] for l in L[ip + 1:ip + 1 + nat]])
fz = P[:, 2] if 'crystal' in hdr else ((P * (BOHR if 'bohr' in hdr else 1.0)) @ np.linalg.inv(C))[:, 2]
z = np.mod(fz, 1.0) * lz

D = np.loadtxt(a.dat)
x = D[:, 0] * BOHR; drho = D[:, 1] / BOHR**3                    # e/A^3
if abs(x[-1] + (x[1] - x[0]) - lz) > 0.05 * lz:
    sys.exit(f'{a.dat} spans {x[-1]:.2f} A, the cell is {lz:.2f} A -- wrong file?')

# start the integral in the middle of the vacuum (largest gap between atoms)
s = np.sort(z); g = np.diff(np.concatenate([s, [s[0] + lz]])); k = int(np.argmax(g))
z_start = np.mod(s[k] + g[k] / 2, lz)
order = np.argsort(np.mod(x - z_start, lz))
xu = np.mod(x - z_start, lz)[order]; du = drho[order]
dz = x[1] - x[0]
Q = area * np.cumsum(du) * dz                                   # electrons
zu = np.mod(z - z_start, lz)

ox = np.arange(nat) < a.n_oxide
ox_below = zu[ox].mean() < zu[~ox].mean()
lo, hi = (ox, ~ox) if ox_below else (~ox, ox)
z_lo_top, z_hi_bot = zu[lo].max(), zu[hi].min()
z0 = 0.5 * (z_lo_top + z_hi_bot)
q0 = np.interp(z0, xu, Q)
below = 'TiO2' if ox_below else 'MXene'
dq_ox = q0 if ox_below else -q0
# thesis convention (Ch. 2, Eq. qtransfer; Ch. 4, Eq. dq): evaluated where Delta_rho changes
# sign between the layers; positive = net electron accumulation on the MXene side
m = (xu > z_lo_top) & (xu < z_hi_bot)
zc = None
if m.sum() > 2:
    xs, ds = xu[m], du[m]
    cr = [xs[i] - ds[i] * (xs[i + 1] - xs[i]) / (ds[i + 1] - ds[i])
          for i in range(len(xs) - 1) if ds[i] == 0 or ds[i] * ds[i + 1] < 0]
    if cr:
        zc = min(cr, key=lambda c: abs(c - z0))
qc = np.interp(zc, xu, Q) if zc is not None else None

print(f'{a.dat}:  A = {area:.3f} A^2,  Lz = {lz:.3f} A')
print(f'  integral of Delta_rho over the cell : {Q[-1]:+.4f} e   (should be ~0)')
print(f'  interface plane z0 = {np.mod(z0 + z_start, lz):.3f} A  '
      f'(midway between {np.mod(z_lo_top + z_start, lz):.3f} and {np.mod(z_hi_bot + z_start, lz):.3f} A)')
print(f'  Delta_Q(z0) = {q0:+.4f} e  -> the {below} slab (below the plane) '
      f'{"gains" if q0 > 0 else "loses"} {abs(q0):.4f} electrons')
print(f'  TiO2: {dq_ox:+.4f} e per cell = {dq_ox / area * 100:+.3f} e/nm^2   '
      f'({"electrons into the oxide" if dq_ox > 0 else "electrons out of the oxide (holes in TiO2)"})')
print(f'  extremes of Delta_Q: {Q.min():+.4f} / {Q.max():+.4f} e')
sgn = -1 if ox_below else 1        # electrons on the MXene side = minus electrons gained below (if oxide below)
if zc is not None:
    print(f'  thesis convention (plane where Delta_rho changes sign, z = {np.mod(zc + z_start, lz):.3f} A; '
          f'+ = electrons on the MXene side):  Delta_Q = {sgn * qc:+.3f} e')
else:
    print('  no sign change of Delta_rho between the layers -- quote the midplane value')
print(f'  same convention at the midplane:  Delta_Q = {sgn * q0:+.3f} e')

if a.plot:
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    zz = np.mod(xu + z_start, lz)
    fig, ax = plt.subplots(2, 1, figsize=(7.2, 4.6), dpi=200, sharex=True)
    xx = xu  # plot on the unwrapped axis, labelled in cell coordinates via offset
    ax[0].plot(xx, du * 1e3, color='#0072B2', lw=1.1); ax[0].axhline(0, color='k', lw=0.6)
    ax[0].set_ylabel(r'$\Delta\rho$ (10$^{-3}$ e/Å$^3$)')
    ax[1].plot(xx, Q, color='#D55E00', lw=1.2); ax[1].axhline(0, color='k', lw=0.6)
    ax[1].set_ylabel(r'$\Delta Q$ (e)'); ax[1].set_xlabel(f'z − {z_start:.2f} Å (from mid-vacuum)')
    for axi in ax:
        axi.axvline(z0, color='0.4', ls='--', lw=0.8)
        for zi, o in zip(zu, ox):
            axi.axvline(zi, color='#009E73' if o else '#E69F00', lw=0.3, alpha=0.6)
    ax[1].annotate(f'{q0:+.3f} e', (z0, q0), xytext=(6, 6), textcoords='offset points', fontsize=8)
    fig.tight_layout(); fig.savefig(a.plot); print('  wrote', a.plot)
