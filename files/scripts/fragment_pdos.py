#!/usr/bin/env python3
"""Fragment PDOS of an MXene/TiO2 interface from projwfc.x output.

    python3 fragment_pdos.py  FILPDOS  scf.out  --mxene Ti3C2O2   [--n-oxide 27] [--outdir pdos_csv]

FILPDOS  : the 'filpdos' of projwfc.x (files FILPDOS.pdos_atm#N(X)_wfc#M(l) and FILPDOS.pdos_tot)
scf.out  : pw.x output of the same run (Fermi energy, number of electrons)
--mxene  : name used in the file names (Ti3C2O2 or Ti3C2OH2)
--n-oxide: the first n atoms of ATOMIC_POSITIONS are the TiO2 slab (27 in both interfaces)

Oxide O and MXene O carry the same label 'O', so the two fragments are separated
by atom number, not by label. Output: the same 6-7 CSV files as before
(TiO2_Ti, TiO2_O, <mxene>_Ti, <mxene>_C, <mxene>_O, [<mxene>_H], total PDOS),
each row = E-E_F, s, E-E_F, p, E-E_F, d, E-E_F, f, E-E_F, tot   (states/eV per cell).
"""
import argparse, glob, os, re, sys
import numpy as np

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('filpdos'); ap.add_argument('scf_out')
ap.add_argument('--mxene', required=True)
ap.add_argument('--n-oxide', type=int, default=27)
ap.add_argument('--outdir', default='pdos_csv')
ap.add_argument('--oxide-label', default='Ti1', help='label of the oxide Ti (default Ti1)')
a = ap.parse_args()

O = open(a.scf_out, errors='replace').read()
m = re.findall(r'the Fermi energy is\s+([-\d.]+)\s*ev', O)
if not m:
    sys.exit('no "the Fermi energy is" line in ' + a.scf_out)
ef = float(m[-1])
nel = re.findall(r'number of electrons\s*=\s*([\d.]+)', O)
nel = float(nel[0]) if nel else None

pat = re.compile(r'\.pdos_atm#(\d+)\(([A-Za-z]+\d*)\)_wfc#(\d+)\(([spdf])\)$')
files = sorted(glob.glob(glob.escape(a.filpdos) + '.pdos_atm#*'))
if not files:
    sys.exit(f'no {a.filpdos}.pdos_atm#* files here -- run projwfc.x first')

def read(f):
    hdr = open(f).readline()
    D = np.loadtxt(f, comments='#')
    if 'ldosup' in hdr:                       # nspin = 2: up + down
        return D[:, 0], D[:, 1] + D[:, 2]
    return D[:, 0], D[:, 1]                   # nspin = 1: E, ldos (sum over m)

L = ['s', 'p', 'd', 'f']
acc, labels, E0 = {}, {}, None
for f in files:
    mm = pat.search(f)
    if not mm:
        sys.exit('unexpected file name (spin-orbit run?): ' + f)
    iat, lab, _, l = int(mm.group(1)), mm.group(2), mm.group(3), mm.group(4)
    E, d = read(f)
    if E0 is None:
        E0 = E
    elif len(E) != len(E0) or abs(E - E0).max() > 1e-6:
        sys.exit('energy grids differ between pdos files')
    labels[iat] = lab
    frag = 'TiO2' if iat <= a.n_oxide else a.mxene
    key = (frag, lab.rstrip('0123456789'))
    acc.setdefault(key, {k: np.zeros_like(E0) for k in L})[l] += d

# the split by atom number must agree with the labels: oxide = Ti1 + O only, no Ti1 in the MXene
bad_ox = sorted({labels[i] for i in labels if i <= a.n_oxide} - {a.oxide_label, 'O'})
bad_mx = [i for i in labels if i > a.n_oxide and labels[i] == a.oxide_label]
if bad_ox or bad_mx:
    sys.exit(f'--n-oxide {a.n_oxide} does not match the atom order: oxide part has {bad_ox}, '
             f'MXene atoms labelled {a.oxide_label}: {bad_mx}')

tot_file = a.filpdos + '.pdos_tot'
Dt = np.loadtxt(tot_file, comments='#')
x = E0 - ef
os.makedirs(a.outdir, exist_ok=True)

def write(name, ch):
    tot = sum(ch[k] for k in L)
    cols = []
    for k in L + ['tot']:
        cols += [x, tot if k == 'tot' else ch[k]]
    np.savetxt(os.path.join(a.outdir, name), np.column_stack(cols), delimiter=',', fmt='%.6g')
    return tot

def n_below_ef(y):
    msk = x <= 0
    return np.trapezoid(y[msk], x[msk])

print(f'E_F = {ef:.4f} eV   valence electrons (scf) = {nel}')
print(f'{"file":<26}{"atoms":>7}{"N(E<E_F)":>11}{"DOS(E_F)":>11}')
order = sorted(acc, key=lambda k: (k[0] != 'TiO2', ['Ti', 'C', 'O', 'H'].index(k[1]) if k[1] in 'Ti C O H'.split() else 9))
proj_sum = np.zeros_like(E0); all_l = {k: np.zeros_like(E0) for k in L}
for frag, el in order:
    ch = acc[(frag, el)]
    name = f'{frag}_{el}_PDOS.csv'
    tot = write(name, ch)
    proj_sum += tot
    for k in L:
        all_l[k] += ch[k]
    nat = sum(1 for i in labels if (('TiO2' if i <= a.n_oxide else a.mxene) == frag
                                    and labels[i].rstrip('0123456789') == el))
    print(f'{name:<26}{nat:>7}{n_below_ef(tot):>11.2f}{np.interp(0, x, tot):>11.3f}')
write('total PDOS.csv', all_l)
print(f'{"total PDOS.csv":<26}{len(labels):>7}{n_below_ef(proj_sum):>11.2f}{np.interp(0, x, proj_sum):>11.3f}')

# checks
dev = abs(proj_sum - Dt[:, 2]).max() / max(Dt[:, 2].max(), 1e-12)
print(f'check: fragments add up to pdos_tot(pdos) within {100*dev:.2e} % of its maximum')
if nel:
    print(f'check: total DOS integrated to E_F = {n_below_ef(Dt[:, 1]):.2f}  (should be close to {nel:.0f}); '
          f'projected = {n_below_ef(Dt[:, 2]):.2f}  (smaller by the spilling)')
print('wrote', a.outdir + '/')
