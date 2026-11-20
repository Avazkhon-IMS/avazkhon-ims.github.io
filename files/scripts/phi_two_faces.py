#!/usr/bin/env python3
"""Work function of BOTH faces of a dipole-corrected MXene/TiO2 slab.

    python3 phi_two_faces.py  avg.dat  iface_O_dip.scf.in  iface_O_dip.scf.out  [--plot phi.png]

avg.dat      : output of average.x (x in bohr, planar average in Ry)
scf.in       : the dipole-corrected input (positions, cell, emaxpos, eopreg)
scf.out      : its output (Fermi energy, convergence, forces, dipole)

For each face the vacuum level is the mean potential over a window that starts
--margin A outside the outermost atom and stops --gap A before the dipole zone.
The oxide face is recognised by the 'Ti1' label the builder gives oxide Ti.
"""
import argparse, re, sys
import numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0] if '/' in __file__ else '.')
from make_dipole_scf import cell_angstrom, get_value, card_index

BOHR, RY = 0.529177210903, 13.605693122994

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('avg'); ap.add_argument('scf_in'); ap.add_argument('scf_out')
    ap.add_argument('--margin', type=float, default=3.5)
    ap.add_argument('--gap', type=float, default=1.0)
    ap.add_argument('--oxide-label', default='Ti1')
    ap.add_argument('--plot', default='')
    a = ap.parse_args()

    # ------------------------------------------------------------------ inputs
    L = open(a.scf_in).read().splitlines()
    nat = int(get_value(L, 'nat'))
    emax = float(get_value(L, 'emaxpos')); eop = float(get_value(L, 'eopreg'))
    C = cell_angstrom(L); lz = np.linalg.norm(C[2])
    ip = card_index(L, 'ATOMIC_POSITIONS'); hdr = L[ip].lower()
    lab = [l.split()[0] for l in L[ip + 1:ip + 1 + nat]]
    pos = np.array([[float(x) for x in l.split()[1:4]] for l in L[ip + 1:ip + 1 + nat]])
    f = pos if 'crystal' in hdr else (pos * (BOHR if 'bohr' in hdr else 1.0)) @ np.linalg.inv(C)
    O = open(a.scf_out, errors='replace').read()
    if 'End final coordinates' in O:            # relax run: use the final geometry
        from make_dipole_scf import read_final_positions, frac_z
        blk, _ = read_final_positions(a.scf_out, nat)
        f = np.zeros((nat, 3)); f[:, 2] = frac_z(blk, C)
        print('  (relax run: using the final coordinates from the output)')
    z = np.mod(f[:, 2], 1.0) * lz
    m = re.findall(r'the Fermi energy is\s+([-\d.]+)\s*ev', O)
    if not m:
        sys.exit('no "the Fermi energy is" line in the scf output')
    ef = float(m[-1])
    conv = 'convergence has been achieved' in O
    tf = re.findall(r'Total force =\s+([\d.]+)', O)
    fmax = None
    # forces: the block right after the LAST "Forces acting on atoms" header
    last = O.rfind('Forces acting on atoms')
    fl = re.findall(r'atom\s+\d+\s+type\s+\d+\s+force =\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)',
                    O[last:] if last >= 0 else '')
    # if_pos flags from the input: fixed components are excluded from the check
    flags = []
    for l in L[ip + 1:ip + 1 + nat]:
        t = l.split()
        flags.append([int(q) for q in t[4:7]] if len(t) >= 7 else [1, 1, 1])
    flags = np.array(flags, float)
    if len(fl) >= nat:
        F = np.array(fl[:nat], float) * flags      # first block = total forces
        fmax = np.linalg.norm(F, axis=1).max()
    dip = re.findall(r'Dipole\s+([-\d.]+)\s+Ry au,\s+([-\d.]+)\s+Debye', O)

    # ------------------------------------------------------------------ profile
    D = np.loadtxt(a.avg)
    x = D[:, 0] * BOHR
    if x.max() > 1.5 * lz or x.max() < 0.5 * lz:
        sys.exit(f'avg.dat length {x.max():.2f} A does not match the cell height {lz:.2f} A')
    v = D[:, 1] * RY

    # unwrap the slab: vacuum is the largest gap in z
    s = np.sort(z); g = np.diff(np.concatenate([s, [s[0] + lz]])); k = int(np.argmax(g))
    top, bot = s[k], s[(k + 1) % len(s)]           # top surface, bottom surface (+lz)
    zd0, zd1 = emax * lz, (emax + eop) * lz
    def unwrap(t):   # map into [top, top+lz)
        return top + np.mod(t - top, lz)
    zd0u, zd1u = unwrap(zd0), unwrap(zd1)
    botu = unwrap(bot) if unwrap(bot) > top else unwrap(bot) + lz
    if not (top < zd0u < zd1u < botu):
        sys.exit('the dipole zone is not inside the vacuum -- check emaxpos/eopreg')
    win = {'top': (top + a.margin, zd0u - a.gap), 'bottom': (zd1u + a.gap, botu - a.margin)}

    # which face is the oxide?  outermost oxide-Ti vs outermost carbide-Ti
    zu = unwrap(z); zu[zu > botu] -= lz
    # compare the mean height of oxide Ti ('Ti1') with that of the MXene Ti ('Ti')
    base = a.oxide_label.rstrip('0123456789')
    ox = np.array([l == a.oxide_label for l in lab])
    same = np.array([l.rstrip('0123456789') == base for l in lab]) & ~ox
    single = not (ox.any() and same.any())     # a reference slab: only one material
    if single:
        name = {'top': 'top', 'bottom': 'bottom'}
    else:
        top_is_oxide = zu[ox].mean() > zu[same].mean()
        name = {'top': 'oxide' if top_is_oxide else 'MXene', 'bottom': 'MXene' if top_is_oxide else 'oxide'}

    res = {}
    xu = unwrap(x)
    for face, (w0, w1) in win.items():
        msk = (xu >= w0) & (xu <= w1)
        if msk.sum() < 5 or w1 - w0 < 1.0:
            sys.exit(f'{face} window {w0:.2f}-{w1:.2f} A too short: lower --margin/--gap or move emaxpos')
        p = np.polyfit(xu[msk], v[msk], 1)
        res[face] = dict(V=v[msk].mean(), slope=p[0], span=np.ptp(v[msk]), w=(w0, w1))

    # ------------------------------------------------------------------ report
    W = 74
    print('=' * W)
    print(f'  {a.scf_in}')
    print('=' * W)
    print(f'  scf converged : {"yes" if conv else "NO -- do not use these numbers"}')
    print(f'  E_F           : {ef:+.4f} eV')
    if fmax is not None and single:
        print('  forces        : not checked (reference fragment frozen in the interface geometry)')
    elif fmax is not None:
        verdict = 'geometry can be kept' if fmax < 5e-3 else 're-relax with the dipole correction (README step 3b)'
        print(f'  max |force|   : {fmax:.5f} Ry/bohr on free atoms ({fmax*RY/BOHR:.3f} eV/A) -> {verdict}')
    if dip:
        print(f'  slab dipole   : {float(dip[-1][1]):+.3f} Debye  (last scf step)')
    print(f'  dipole zone   : {zd0:.2f}-{zd1:.2f} A of Lz = {lz:.2f} A')
    print('  ' + '-' * (W - 4))
    print(f'  {"face":<8}{"window (A)":>18}{"E_vac (eV)":>12}{"Phi (eV)":>10}{"slope eV/A":>12}{"span":>8}')
    for face in ('top', 'bottom'):
        r = res[face]
        print(f'  {name[face]:<8}{r["w"][0]:>8.2f} -{r["w"][1]:>8.2f}{r["V"]:>12.4f}{r["V"]-ef:>10.4f}{r["slope"]:>+12.4f}{r["span"]:>8.3f}')
    print('  ' + '-' * (W - 4))
    phi = {name[f]: res[f]['V'] - ef for f in res}
    if single:
        print('  single-material slab (reference run): faces named top / bottom')
        print(f'  Phi(top) = {phi["top"]:.3f} eV   Phi(bottom) = {phi["bottom"]:.3f} eV   '
              f'step = {phi["top"] - phi["bottom"]:+.3f} eV')
    else:
        print(f'  Phi(MXene face) = {phi["MXene"]:.3f} eV')
        print(f'  Phi(oxide face) = {phi["oxide"]:.3f} eV')
        print(f'  step across the slab  Phi(oxide) - Phi(MXene) = {phi["oxide"] - phi["MXene"]:+.3f} eV')
    worst = max(abs(res[f]['slope']) for f in res)
    ok = worst < 0.01 and conv
    print('  ' + ('plateaus flat (|slope| < 0.01 eV/A): numbers are quotable.' if ok else
                  'NOT OK: a plateau is sloped or the scf did not converge -- see README, step 6.'))
    if not all(0.5 < v < 10 for v in phi.values()):
        print('  WARNING: Phi outside 0.5-10 eV -- check that avg.dat is in Ry (plot_num=11).')
    print('=' * W)

    if a.plot:
        import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
        fig, ax = plt.subplots(figsize=(7.2, 3.4), dpi=200)
        ax.plot(x, v, color='#D55E00', lw=1.2)
        ax.axhline(ef, color='k', ls='--', lw=0.8); ax.text(0.3, ef + 0.3, r'$E_F$', fontsize=9)
        for face, r in res.items():
            w0, w1 = r['w']
            for a0, a1 in ((w0, w1), (w0 - lz, w1 - lz)):
                if a1 > 0 and a0 < lz:
                    ax.plot([max(a0, 0), min(a1, lz)], [r['V'], r['V']], color='#1E8474', lw=2)
            xm = np.mod(0.5 * (w0 + w1), lz)
            ax.text(xm, r['V'] + 0.5, f"{name[face]}: {r['V'] - ef:.2f} eV", ha='center', fontsize=8, color='#1E8474')
        ax.axvspan(zd0, zd1, color='#B3453A', alpha=0.15, lw=0)
        ax.set_xlim(0, 35.2); ax.set_ylim(min(ef - 8, -18), max(r['V'] for r in res.values()) + 2.5)
        ax.set_xlabel('z (Å)'); ax.set_ylabel('planar-averaged V (eV)')
        fig.tight_layout(); fig.savefig(a.plot); print('  wrote', a.plot)

if __name__ == '__main__':
    main()
