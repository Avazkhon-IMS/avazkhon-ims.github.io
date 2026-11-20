#!/usr/bin/env python3
"""Ti3C2O2 / anatase-TiO2(001) heterostructure builder.

Reads your two CIF files, finds a commensurate supercell pair, stacks them,
and writes ready-to-run Quantum ESPRESSO inputs for the interface AND for the
two reference calculations that the adhesion energy needs.

    E_adh = [ E(interface) - E(MXene alone) - E(slab alone) ] / A

Both references are written in the SAME strained cell as the interface, so no
strain energy leaks into E_adh.

Usage
-----
    python3 make_heterostructure.py
    python3 make_heterostructure.py --layers 4 --choice 1 --gap 2.4
    python3 make_heterostructure.py --mxene Ti3C2OH2_unit.cif --tag OH

Everything it does is printed; nothing is silently assumed.
"""
import argparse
import itertools
import math
import os
import numpy as np
from ase.io import read, write

# --------------------------------------------------------------- defaults
MXENE_CIF = 'Ti3C2(HO)2_unit.cif'
ANATASE_CIF = 'TiO2_anatase.cif'

UPF = {'Ti': 'Ti.pbe-spn-rrkjus_psl.1.0.0.UPF',
       'Ti1': 'Ti.pbe-spn-rrkjus_psl.1.0.0.UPF',   # same file, separate label
       'C': 'C.pbe-n-rrkjus_psl.1.0.0.UPF',
       'O': 'O.pbe-n-rrkjus_psl.1.0.0.UPF',
       'H': 'H.pbe-rrkjus_psl.1.0.0.UPF'}
MASS = {'Ti': 47.867, 'Ti1': 47.867, 'C': 12.0107, 'O': 15.9994, 'H': 1.00794}


# ------------------------------------------------------------ oxide slab
def anatase_slab(bulk, n_trilayers):
    """Stoichiometric anatase(001) slab of n TiO2 trilayers per 1x1 cell.

    In this cell each Ti plane carries one O plane 0.40 A above and one 0.40 A
    below it, and the Ti planes repeat every c/4 = 2.37 A.  Selecting whole
    trilayers therefore guarantees TiO2 stoichiometry and two equivalent
    O-terminated surfaces.
    """
    big = bulk.repeat((1, 1, 2))
    sym = np.array(big.get_chemical_symbols())
    z = big.get_positions()[:, 2]
    ti_z = np.unique(np.round(z[sym == 'Ti'], 4))
    if len(ti_z) < n_trilayers + 1:
        raise ValueError('slab too thick for a 2x z repeat')
    lo, hi = ti_z[1], ti_z[n_trilayers]          # skip the lowest Ti plane
    keep = [i for i, zz in enumerate(z) if lo - 0.6 <= zz <= hi + 0.6]
    slab = big[keep]
    slab.positions[:, 2] -= slab.positions[:, 2].min()

    cell = bulk.get_cell().array.copy()
    cell[2] = [0, 0, slab.positions[:, 2].max() + 1.0]
    slab.set_cell(cell)
    slab.pbc = [True, True, True]

    s = np.array(slab.get_chemical_symbols())
    nti, no = (s == 'Ti').sum(), (s == 'O').sum()
    if no != 2 * nti:
        raise ValueError(f'slab is not stoichiometric: Ti{nti}O{no}')
    return slab


# ------------------------------------------------------- lattice matching
def reduced_cells(C2, nmax, area_max, min_angle=45.0):
    out = {}
    vs = [(i, j, i * C2[0] + j * C2[1])
          for i in range(-nmax, nmax + 1) for j in range(-nmax, nmax + 1)
          if (i, j) != (0, 0)]
    for (i1, j1, w1), (i2, j2, w2) in itertools.combinations(vs, 2):
        A = abs(w1[0] * w2[1] - w1[1] * w2[0])
        if A < 1e-6 or A > area_max:
            continue
        L1, L2 = np.linalg.norm(w1), np.linalg.norm(w2)
        c1, c2 = (i1, j1), (i2, j2)
        if L1 > L2:
            L1, L2, c1, c2, w1, w2 = L2, L1, c2, c1, w2, w1
        ang = math.degrees(math.acos(max(-1, min(1, np.dot(w1, w2) / (L1 * L2)))))
        if ang > 90:
            ang = 180 - ang
        if ang < min_angle:
            continue
        out.setdefault((round(A, 3), round(L1, 3), round(L2, 3), round(ang, 2)),
                       (A, L1, L2, ang, c1, c2))
    return list(out.values())


def find_matches(mx, ox, max_atoms, max_strain, max_dangle=2.0, nmax=6):
    cm = mx.get_cell().array[:2, :2]
    co = ox.get_cell().array[:2, :2]
    am, ao = abs(np.linalg.det(cm)), abs(np.linalg.det(co))
    MX = reduced_cells(cm, nmax, am * max_atoms / len(mx))
    OX = reduced_cells(co, nmax, ao * max_atoms / len(ox))
    hits = []
    for (Am, l1m, l2m, angm, u1, u2) in MX:
        for (Ao, l1o, l2o, ango, w1, w2) in OX:
            e1 = (l1m - l1o) / l1o * 100
            e2 = (l2m - l2o) / l2o * 100
            if (abs(e1) < max_strain and abs(e2) < max_strain
                    and abs(angm - ango) < max_dangle):
                nm, no = round(Am / am), round(Ao / ao)
                nat = nm * len(mx) + no * len(ox)
                if nm < 1 or no < 1 or nat > max_atoms:
                    continue
                hits.append(dict(natoms=nat, strain=max(abs(e1), abs(e2)),
                                 M=(u1, u2), S=(w1, w2), l1=l1o, l2=l2o,
                                 angle=ango, e1=e1, e2=e2, dang=angm - ango,
                                 nm=nm, no=no))
    hits.sort(key=lambda h: (h['natoms'], h['strain']))
    seen, uniq = set(), []
    for h in hits:
        k = (h['nm'], h['no'], round(h['strain'], 2))
        if k not in seen:
            seen.add(k)
            uniq.append(h)
    return uniq


def supercell_2d(atoms, mat):
    from ase.build import make_supercell
    P = np.array([[mat[0][0], mat[0][1], 0], [mat[1][0], mat[1][1], 0], [0, 0, 1]],
                 dtype=int)
    if np.linalg.det(P) < 0:
        P[[0, 1]] = P[[1, 0]]
    return make_supercell(atoms, P)


# ------------------------------------------------------------- stacking
def stack(mx_sc, ox_sc, gap, vacuum):
    """MXene on top of the oxide, in the OXIDE's in-plane cell.

    The oxide keeps its relaxed lattice because its band edges are the
    quantity being aligned; the carbide absorbs the residual strain, and that
    strain is measured by the MXene reference calculation.
    """
    cell = ox_sc.get_cell().array.copy()
    mx = mx_sc.copy()

    frac = mx.get_scaled_positions()
    zabs = mx.get_positions()[:, 2]
    new = mx.get_cell().array.copy()
    new[:2, :2] = cell[:2, :2]
    mx.set_cell(new)
    mx.set_scaled_positions(frac)
    p = mx.get_positions()
    p[:, 2] = zabs                              # z untouched by in-plane strain
    mx.set_positions(p)

    shift = (ox_sc.get_positions()[:, 2].max() + gap) - mx.get_positions()[:, 2].min()
    p = mx.get_positions(); p[:, 2] += shift; mx.set_positions(p)

    iface = ox_sc + mx
    n_ox = len(ox_sc)
    zz = iface.get_positions()[:, 2]
    cell[2] = [0, 0, (zz.max() - zz.min()) + vacuum]
    iface.set_cell(cell)
    iface.center(axis=2)
    iface.pbc = [True, True, True]
    return iface, n_ox


# --------------------------------------------------------- QE input file
def kmesh(cell, spacing=0.25):
    """Monkhorst-Pack mesh from a target reciprocal spacing (1/A)."""
    k = []
    for i in range(2):
        L = np.linalg.norm(cell[i])
        k.append(max(1, int(round(2 * math.pi / (L * spacing)))))
    return (k[0], k[1], 1)


def write_qe(atoms, path, *, n_ox, calculation, kpts, hubbard_u,
             fix_bottom=0.0, title=''):
    """Write a QE input with the oxide Ti relabelled Ti1 so U hits only it."""
    sym = list(atoms.get_chemical_symbols())
    labels = []
    for i, s in enumerate(sym):
        labels.append('Ti1' if (s == 'Ti' and i < n_ox) else s)

    pos = atoms.get_positions()
    zmin = pos[:, 2].min()
    fixed = [(i < n_ox) and (pos[i][2] - zmin < fix_bottom) for i in range(len(atoms))]

    species = sorted(set(labels))
    cell = atoms.get_cell().array

    lines = []
    if title:
        lines.append(f"! {title}")
    lines += ["&CONTROL",
              f"    calculation   = '{calculation}'",
              "    prefix        = 'mxtio2'",
              "    outdir        = './out'",
              "    pseudo_dir    = '<path to SSSP_1.3.0_PBE_efficiency>'",
              "    forc_conv_thr = 1.0d-3",
              "    nstep         = 300",
              "    tprnfor       = .TRUE.",
              "/",
              "&SYSTEM",
              "    ibrav           = 0",
              f"    nat             = {len(atoms)}",
              f"    ntyp            = {len(species)}",
              "    nspin           = 1",
              "    ecutwfc         = 40.0",
              "    ecutrho         = 320.0",
              "    occupations     = 'smearing'",
              "    smearing        = 'fd'",
              "    degauss         = 1.0d-2",
              "    assume_isolated = '2D'",
              "    input_dft       = 'PBE'",
              "    vdw_corr        = 'grimme-d3'",
              "    dftd3_version   = 4",
              "/",
              "&ELECTRONS",
              "    conv_thr         = 1.0d-6",
              "    electron_maxstep = 300",
              "    diagonalization  = 'david'",
              "    mixing_beta      = 0.4",
              "    mixing_mode      = 'plain'",
              "/"]
    if calculation == 'relax':
        lines += ["&IONS", "    ion_dynamics = 'bfgs'", "/"]

    if hubbard_u and 'Ti1' in species:
        lines += ["", "HUBBARD (ortho-atomic)",
                  f"    U Ti1-3d  {hubbard_u}"]

    lines += ["", "ATOMIC_SPECIES"]
    for s in species:
        lines.append(f"  {s:4s} {MASS[s]:9.5f}  {UPF[s]}")

    lines += ["", "CELL_PARAMETERS angstrom"]
    for v in cell:
        lines.append(f"  {v[0]:15.9f} {v[1]:15.9f} {v[2]:15.9f}")

    lines += ["", "ATOMIC_POSITIONS angstrom"]
    for i, (lab, p) in enumerate(zip(labels, pos)):
        tail = "  0 0 0" if fixed[i] else ""
        lines.append(f"  {lab:4s} {p[0]:14.9f} {p[1]:14.9f} {p[2]:14.9f}{tail}")

    lines += ["", "K_POINTS automatic",
              f"  {kpts[0]} {kpts[1]} {kpts[2]} 0 0 0", ""]
    open(path, 'w').write("\n".join(lines))
    return sum(fixed)


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--mxene', default=MXENE_CIF)
    ap.add_argument('--anatase', default=ANATASE_CIF)
    ap.add_argument('--layers', type=int, default=3, help='TiO2 trilayers')
    ap.add_argument('--gap', type=float, default=2.6)
    ap.add_argument('--vacuum', type=float, default=20.0)
    ap.add_argument('--max-atoms', type=int, default=140)
    ap.add_argument('--max-strain', type=float, default=4.0)
    ap.add_argument('--choice', type=int, default=0)
    ap.add_argument('--hubbard-u', type=float, default=None,
                    help='U on the oxide Ti-3d, eV (omit for plain PBE)')
    ap.add_argument('--fix-bottom', type=float, default=2.5,
                    help='freeze oxide atoms within this many A of the bottom')
    ap.add_argument('--tag', default='O')
    args = ap.parse_args()

    mx = read(args.mxene)
    bulk = read(args.anatase)
    print(f"MXene   {args.mxene}: {mx.get_chemical_formula()}, "
          f"{len(mx)} atoms, a = {np.linalg.norm(mx.get_cell()[0]):.4f} A")
    print(f"anatase {args.anatase}: {bulk.get_chemical_formula()}, "
          f"a = {np.linalg.norm(bulk.get_cell()[0]):.4f} A, "
          f"c = {np.linalg.norm(bulk.get_cell()[2]):.4f} A")

    ox = anatase_slab(bulk, args.layers)
    zz = ox.get_positions()[:, 2]
    print(f"\nslab: {args.layers} TiO2 trilayers -> {ox.get_chemical_formula()}, "
          f"{len(ox)} atoms per 1x1 cell, {zz.max() - zz.min():.2f} A thick")

    cand = find_matches(mx, ox, args.max_atoms, args.max_strain)
    if not cand:
        print("\nno commensurate cell found — raise --max-atoms or --max-strain")
        return
    print(f"\n{'#':>2s} {'atoms':>6s} {'strain':>8s} {'cell (A)':>21s} "
          f"{'angle':>8s}  MXene/oxide")
    for i, h in enumerate(cand[:8]):
        print(f"{i:2d} {h['natoms']:6d} {h['strain']:7.2f}% "
              f"{h['l1']:9.3f} x{h['l2']:8.3f} {h['angle']:7.2f}deg  "
              f"{h['nm']:3d} / {h['no']:2d}")

    h = cand[args.choice]
    print(f"\nbuilding #{args.choice}: {h['nm']} MXene cells on {h['no']} oxide cells")
    mx_sc = supercell_2d(mx, h['M'])
    ox_sc = supercell_2d(ox, h['S'])
    print(f"  MXene {mx_sc.get_chemical_formula()} ({len(mx_sc)})  "
          f"oxide {ox_sc.get_chemical_formula()} ({len(ox_sc)})")
    print(f"  strain put on the MXene: a1 {h['e1']:+.2f} %, a2 {h['e2']:+.2f} %, "
          f"angle {h['dang']:+.2f} deg")

    iface, n_ox = stack(mx_sc, ox_sc, args.gap, args.vacuum)
    cell = iface.get_cell().array
    kp = kmesh(cell)
    area = abs(np.cross(cell[0], cell[1])[2])
    print(f"\ninterface: {iface.get_chemical_formula()}, {len(iface)} atoms")
    print(f"  in-plane area {area:.2f} A^2, Lz = {cell[2][2]:.2f} A, "
          f"k-mesh {kp[0]}x{kp[1]}x{kp[2]}")

    # references in the SAME cell
    mx_ref = iface[[i for i in range(len(iface)) if i >= n_ox]]
    ox_ref = iface[[i for i in range(len(iface)) if i < n_ox]]
    for a in (mx_ref, ox_ref):
        a.set_cell(cell); a.pbc = [True, True, True]

    tag = args.tag
    nfix = write_qe(iface, f'iface_{tag}.in', n_ox=n_ox, calculation='relax',
                    kpts=kp, hubbard_u=args.hubbard_u,
                    fix_bottom=args.fix_bottom,
                    title=f'Ti3C2{tag}2 / anatase(001) interface')
    write_qe(ox_ref, f'slab_ref_{tag}.in', n_ox=len(ox_ref), calculation='scf',
             kpts=kp, hubbard_u=args.hubbard_u, fix_bottom=0.0,
             title='anatase slab alone, interface cell (E_adh reference)')
    write_qe(mx_ref, f'mxene_ref_{tag}.in', n_ox=0, calculation='scf',
             kpts=kp, hubbard_u=None, fix_bottom=0.0,
             title='strained MXene alone, interface cell (E_adh reference)')
    write(f'iface_{tag}.cif', iface)
    write(f'iface_{tag}.xyz', iface)

    print(f"\n  frozen oxide atoms (bottom {args.fix_bottom} A): {nfix}")
    print(f"\nwritten:")
    for f in (f'iface_{tag}.in', f'slab_ref_{tag}.in', f'mxene_ref_{tag}.in',
              f'iface_{tag}.cif', f'iface_{tag}.xyz'):
        print(f"   {f}   ({os.path.getsize(f)} bytes)")
    print(f"\nE_adh = [E(iface_{tag}) - E(mxene_ref_{tag}) - E(slab_ref_{tag})] "
          f"/ {area:.2f} A^2")
    if args.hubbard_u is None:
        print("\nNOTE: no Hubbard U was written (plain PBE). Pass --hubbard-u <eV>")
        print("      to put U on the oxide Ti only; the MXene Ti stays bare.")
    print("CHECK in VESTA before submitting: iface_%s.cif" % tag)


if __name__ == '__main__':
    main()
