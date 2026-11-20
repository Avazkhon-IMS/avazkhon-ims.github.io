#!/usr/bin/env python3
"""Shortest contacts across the MXene/TiO2 interface in a pw.x input.

Usage:  python3 interface_contacts.py file.in [--n-oxide 27]

The first --n-oxide atoms in ATOMIC_POSITIONS are taken as the TiO2 slab,
the rest as the MXene (this is the order in both interface inputs).
Positions must be in angstrom; in-plane periodic images are included.
"""
import sys, argparse, itertools
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("file")
ap.add_argument("--n-oxide", type=int, default=27)
args = ap.parse_args()

lines = open(args.file).read().splitlines()
cell, atoms = [], []
for i, l in enumerate(lines):
    u = l.strip().upper()
    if u.startswith("CELL_PARAMETERS"):
        if "ANGSTROM" not in u:
            sys.exit("CELL_PARAMETERS must be in angstrom")
        cell = np.array([[float(x) for x in lines[i + k].split()[:3]] for k in (1, 2, 3)])
    if u.startswith("ATOMIC_POSITIONS"):
        if "ANGSTROM" not in u:
            sys.exit("ATOMIC_POSITIONS must be in angstrom")
        atoms = []
        for l2 in lines[i + 1:]:
            p = l2.split()
            if len(p) < 4:
                break
            try:
                atoms.append((p[0], np.array([float(x) for x in p[1:4]])))
            except ValueError:
                break
if len(cell) == 0 or not atoms:
    sys.exit("could not read CELL_PARAMETERS / ATOMIC_POSITIONS")

ox, mx = atoms[:args.n_oxide], atoms[args.n_oxide:]
shifts = [i * cell[0] + j * cell[1] for i, j in itertools.product((-1, 0, 1), repeat=2)]

def base(sp):            # 'Ti1' -> 'Ti'
    return sp.rstrip("0123456789")

best = {}
for io, (so, ro) in enumerate(ox, 1):
    for im, (sm, rm) in enumerate(mx, args.n_oxide + 1):
        d = min(np.linalg.norm(rm + s - ro) for s in shifts)
        key = f"{base(sm)}(MXene)-{base(so)}(TiO2)"
        if key not in best or d < best[key][0]:
            best[key] = (d, im, io)

ztop_ox = max(r[2] for _, r in ox)
zbot_mx = min(r[2] for _, r in mx)
print(f"{args.file}: {len(ox)} oxide + {len(mx)} MXene atoms")
print(f"  highest oxide atom z = {ztop_ox:.3f} A, lowest MXene atom z = {zbot_mx:.3f} A,"
      f" vertical gap = {zbot_mx - ztop_ox:.3f} A")
for key, (d, im, io) in sorted(best.items(), key=lambda kv: kv[1][0]):
    print(f"  shortest {key:<18s} {d:6.3f} A   (atoms {im} and {io})")
