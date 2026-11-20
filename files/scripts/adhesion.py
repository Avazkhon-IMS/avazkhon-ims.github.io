#!/usr/bin/env python3
"""Adhesion energy (work of separation) of an MXene/TiO2 interface.

    python3 adhesion.py  P.scf.in  P.scf.out  P_refTiO2.scf.out  P_refMX.scf.out

E_adh = [E(TiO2 alone) + E(MXene alone) - E(interface)] / A
with both fragments frozen in their interface geometry, in the same cell, k-mesh and
FFT grid (plane waves: no basis-set superposition error). E_adh > 0 means bound (same quantity as E0/A of thesis Ch. 2, Eq. eadh).
The script refuses to give a number if the three runs are not comparable.
"""
import os, re, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_dipole_scf import cell_angstrom

RY = 13.605693122994
if len(sys.argv) != 5:
    sys.exit(__doc__)
scf_in, outs = sys.argv[1], sys.argv[2:]
C = cell_angstrom(open(scf_in).read().splitlines())
area = np.linalg.norm(np.cross(C[0], C[1]))

info = []
for f in outs:
    O = open(f, errors='replace').read()
    e = re.findall(r'^!\s+total energy\s+=\s+([-\d.]+)\s+Ry', O, re.M)
    d = re.findall(r'Dispersion Correction\s+=\s+([-\d.]+)\s+Ry', O)
    fft = re.findall(r'FFT dimensions:\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\)', O)
    nk = re.findall(r'number of k points=\s*(\d+)', O)
    info.append(dict(f=f, E=float(e[-1]) if e else None, D=float(d[-1]) if d else None,
                     conv='convergence has been achieved' in O,
                     fft=fft[0] if fft else None, nk=nk[0] if nk else None))

ok = True
for i in info:
    print(f"  {i['f']:<40s} E = {i['E']} Ry  conv={'yes' if i['conv'] else 'NO'}  FFT={i['fft']}  nk={i['nk']}")
    ok &= i['conv'] and i['E'] is not None
if len({i['fft'] for i in info}) != 1:
    print('  !! FFT grids differ -- set nr1/nr2/nr3 of the interface in the reference inputs'); ok = False
if len({i['nk'] for i in info}) != 1:
    print('  !! numbers of k-points differ (symmetry?) -- add nosym=.true. to all three and rerun'); ok = False
if not ok:
    sys.exit('  no adhesion energy: the three runs are not comparable')

Ei, Eo, Em = (i['E'] for i in info)
W = (Eo + Em - Ei) * RY
print(f'  A = {area:.3f} A^2')
print(f'  E_adh = {W:.4f} eV per cell = {1e3 * W / area:.2f} meV/A^2 = {W / area * 16.02177:.3f} J/m^2')
if all(i['D'] is not None for i in info):
    Wd = (info[1]['D'] + info[2]['D'] - info[0]['D']) * RY
    print(f'  of which D3 dispersion: {Wd:.4f} eV ({100 * Wd / W:.0f} %)')
