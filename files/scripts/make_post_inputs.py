#!/usr/bin/env python3
"""All post-processing inputs for one converged MXene/TiO2 interface scf.

    python3 make_post_inputs.py  ti3c2o2_tio2_scf.in  [--n-oxide 27] [--mxene Ti3C2O2]

Reads prefix/outdir from the scf input and writes, in the current directory
(P = the prefix of the scf, e.g. ti3c2o2_tio2_dip):

  A. from the interface scf only (no new pw.x run)
     P.pp_pot.in        pp.x       plot_num=11, electrostatic potential incl. dipole correction
     P.avg_pot.in       average.x  planar average -> work function of both faces
     P.projwfc.in       projwfc.x  PDOS (fragments are summed by fragment_pdos.py)

  B. two reference scf runs in the SAME cell and geometry (fragments cut from the interface)
     P_refTiO2.scf.in   the oxide slab alone   (atoms 1..n_oxide)
     P_refMX.scf.in     the MXene alone        (the remaining atoms)
     P.pp_rho.in, P_refTiO2.pp_rho.in, P_refMX.pp_rho.in    pp.x plot_num=0 (charge density)
     P.avg_drho.in      average.x  planar average of  rho(int) - rho(TiO2) - rho(MXene)
     P.drho_cube.in     pp.x       the same difference as a 3-D .cube file (VESTA isosurfaces)
     P_refTiO2.pp_pot.in / .avg_pot.in, P_refMX.pp_pot.in / .avg_pot.in   work functions of the fragments
     P_refTiO2.projwfc.in   band edges of the oxide alone

Everything else in the reference inputs is copied unchanged (cell, cutoffs, k-mesh,
smearing, D3, dipole correction), so the three runs share one FFT grid, as the
density difference and the adhesion energy require.
"""
import argparse, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_dipole_scf import card_index, get_value

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('scf_in')
ap.add_argument('--n-oxide', type=int, default=27)
ap.add_argument('--oxide-label', default='Ti1')
ap.add_argument('--degauss-pdos', default='0.005')
a = ap.parse_args()

L = open(a.scf_in).read().splitlines()
P = get_value(L, 'prefix'); outdir = get_value(L, 'outdir') or './'
nat = int(get_value(L, 'nat'))
if (get_value(L, 'calculation') or 'scf').lower() != 'scf':
    sys.exit('this is not an scf input')
for bad in ('assume_isolated', 'starting_magnetization', 'Hubbard_U'):
    if get_value(L, bad) is not None:
        print(f'WARNING: {bad} found in {a.scf_in} -- check the reference inputs by hand')
if card_index(L, 'HUBBARD') is not None:
    print('WARNING: HUBBARD card found -- the reference inputs keep it unchanged; check species')

ip = card_index(L, 'ATOMIC_POSITIONS'); isp = card_index(L, 'ATOMIC_SPECIES')
pos = L[ip + 1: ip + 1 + nat]
lab = [l.split()[0] for l in pos]
spec = []
for l in L[isp + 1:]:
    t = l.split()
    if len(t) < 3 or t[0].startswith('!') or t[0].upper() in ('K_POINTS', 'CELL_PARAMETERS', 'ATOMIC_POSITIONS'):
        break
    spec.append(l)
species_order = [s.split()[0] for s in spec]

n = a.n_oxide
if set(lab[:n]) - {a.oxide_label, 'O'} or a.oxide_label in lab[n:]:
    sys.exit(f'atoms 1..{n} must be the oxide ({a.oxide_label}, O) and no {a.oxide_label} may follow -- '
             f'found {sorted(set(lab[:n]))} in the first {n} atoms')

def write(name, text):
    open(name, 'w').write(text.rstrip() + '\n'); print('  wrote', name)

def reference(tag, keep):
    sub = [pos[i] for i in keep]
    used = [s for s in species_order if s in {lab[i] for i in keep}]
    out, i = [], 0
    while i < len(L):
        l = L[i]
        if i == isp:
            out.append(l); out += [s for s in spec if s.split()[0] in used]
            i += 1 + len(spec); continue
        if i == ip:
            out.append(l); out += sub
            i += 1 + nat; continue
        l = re.sub(r"(prefix\s*=\s*)['\"][^'\"]*['\"]", rf"\1'{P}_{tag}'", l, flags=re.I)
        l = re.sub(r'(?<![A-Za-z_])(nat\s*=\s*)\d+', rf'\g<1>{len(sub)}', l, flags=re.I)
        l = re.sub(r'(?<![A-Za-z_])(ntyp\s*=\s*)\d+', rf'\g<1>{len(used)}', l, flags=re.I)
        out.append(l); i += 1
    write(f'{P}_{tag}.scf.in', '\n'.join(out))

def pp(pfx, plot_num, fil, note):
    write(f'{pfx}.pp_{"pot" if plot_num == 11 else "rho"}.in', f"""&INPUTPP
   prefix   = '{pfx}'
   outdir   = '{outdir}'
   filplot  = '{fil}'
   plot_num = {plot_num:<10d}! {note}
/""")

def avg(name, files):
    body = [str(len(files))]
    for f, w in files:
        body += [f, f'{w:.1f}']
    body += ['1000', '3', '1.0']
    write(name, '\n'.join(body))

def projwfc(pfx):
    write(f'{pfx}.projwfc.in', f"""&PROJWFC
   prefix  = '{pfx}'
   outdir  = '{outdir}'
   filpdos = '{pfx}'
   ngauss  = 0
   degauss = {a.degauss_pdos}        ! Ry
   DeltaE  = 0.01
/""")

print('A. interface post-processing')
pp(P, 11, f'{P}.pot', 'V_bare + V_H, includes the dipole correction')
avg(f'{P}.avg_pot.in', [(f'{P}.pot', 1.0)])
projwfc(P)

print('B. reference fragments (same cell, same geometry)')
reference('refTiO2', range(n))
reference('refMX', range(n, nat))
for pfx in (P, f'{P}_refTiO2', f'{P}_refMX'):
    pp(pfx, 0, f'{pfx}.rho', 'valence charge density')
for pfx in (f'{P}_refTiO2', f'{P}_refMX'):
    pp(pfx, 11, f'{pfx}.pot', 'V_bare + V_H, includes the dipole correction')
    avg(f'{pfx}.avg_pot.in', [(f'{pfx}.pot', 1.0)])
projwfc(f'{P}_refTiO2')
avg(f'{P}.avg_drho.in', [(f'{P}.rho', 1.0), (f'{P}_refTiO2.rho', -1.0), (f'{P}_refMX.rho', -1.0)])
write(f'{P}.drho_cube.in', f"""&INPUTPP
   plot_num = -1          ! do not recompute: combine the three existing .rho files
/
&PLOT
   nfile     = 3
   filepp(1) = '{P}.rho',          weight(1) =  1.0
   filepp(2) = '{P}_refTiO2.rho',  weight(2) = -1.0
   filepp(3) = '{P}_refMX.rho',    weight(3) = -1.0
   iflag         = 3
   output_format = 6      ! Gaussian cube, opens in VESTA
   fileout       = '{P}_drho.cube'
/""")
