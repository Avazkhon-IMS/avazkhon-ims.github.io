#!/usr/bin/env python3
"""Turn a finished MXene/TiO2 relax into a dipole-corrected scf for the work function.

    python3 make_dipole_scf.py  relax.in  relax.out

What it does, and nothing else:
  * takes the FINAL relaxed coordinates from relax.out (the block between
    "Begin final coordinates" and "End final coordinates"; if the relax did not
    finish, the last ATOMIC_POSITIONS block, with a warning);
  * copies every other setting of relax.in unchanged (cell, cutoffs, k-mesh,
    smearing, vdW, pseudopotentials);
  * calculation='scf', tprnfor=.true., prefix = <input file name>_dip, so the
    two interfaces never overwrite each other or the old data; &IONS / &CELL
    are dropped (not read in an scf);
  * REMOVES assume_isolated and ADDS the dipole correction
        tefield=.true., dipfield=.true.            (&CONTROL)
        edir=3, emaxpos, eopreg, eamp=0.0          (&SYSTEM)
    with emaxpos chosen automatically in the middle of the vacuum, never
    crossing the cell boundary, and at least --clearance A from every atom;
  * also writes the matching pp.x and average.x inputs.

Requires ibrav=0 with a CELL_PARAMETERS card (what make_heterostructure.py writes).
"""
import argparse, re, sys
import numpy as np

BOHR = 0.529177210903

def namelist_blocks(lines):
    """Return {NAME: (start, end)} line indices of each &NAME ... / block."""
    out, cur, start = {}, None, None
    for i, l in enumerate(lines):
        s = l.strip()
        if cur is None and s.startswith('&'):
            cur, start = s[1:].split()[0].upper(), i
        elif cur is not None and s == '/':
            out[cur] = (start, i); cur = None
    return out

def card_index(lines, name):
    for i, l in enumerate(lines):
        if l.strip().upper().startswith(name):
            return i
    return None

def get_value(lines, key):
    # works for one key per line and for 'ibrav = 0, nat = 7, ntyp = 4'
    for l in lines:
        l = l.split('!', 1)[0]
        m = re.search(r'(?:^|[\s,])' + key + r'\s*=\s*([^,\n]+)', l, re.I)
        if m:
            return m.group(1).strip().strip("'\"")
    return None

def read_final_positions(outfile, nat):
    txt = open(outfile, errors='replace').read().splitlines()
    converged = any('End final coordinates' in l for l in txt)
    if converged:
        i0 = max(i for i, l in enumerate(txt) if 'Begin final coordinates' in l)
        i = next(k for k in range(i0, len(txt)) if txt[k].strip().upper().startswith('ATOMIC_POSITIONS'))
    else:
        idx = [k for k, l in enumerate(txt) if l.strip().upper().startswith('ATOMIC_POSITIONS')]
        if not idx:
            sys.exit(f'no ATOMIC_POSITIONS block found in {outfile}')
        i = idx[-1]
        print('WARNING: "End final coordinates" not found -- the relax did not finish.\n'
              '         Using the LAST geometry printed. Check that the forces were small.')
    block = txt[i:i + 1 + nat]
    if len(block) != nat + 1 or any(len(b.split()) < 4 for b in block[1:]):
        sys.exit('could not read nat atomic lines after ATOMIC_POSITIONS in the output')
    return block, converged

def cell_angstrom(lines):
    i = card_index(lines, 'CELL_PARAMETERS')
    if i is None:
        sys.exit('template has no CELL_PARAMETERS card (needs ibrav=0)')
    hdr = lines[i].lower()
    C = np.array([[float(x) for x in lines[i + k].split()[:3]] for k in (1, 2, 3)])
    if 'bohr' in hdr:
        C *= BOHR
    elif 'alat' in hdr or ('angstrom' not in hdr):
        a = get_value(lines, r'celldm\(1\)')
        if a is None:
            sys.exit('CELL_PARAMETERS in alat units but celldm(1) not found')
        C *= float(a.replace('d', 'e').replace('D', 'e')) * BOHR
    return C

def frac_z(block, C):
    hdr = block[0].lower()
    pos = np.array([[float(x) for x in l.split()[1:4]] for l in block[1:]])
    if 'crystal' in hdr:
        f = pos
    else:
        if 'bohr' in hdr:
            pos = pos * BOHR
        f = pos @ np.linalg.inv(C)
    return np.mod(f[:, 2], 1.0)

def choose_emaxpos(fz, lz, eopreg, clearance):
    s = np.sort(fz)
    gaps = np.diff(np.concatenate([s, [s[0] + 1.0]]))
    k = int(np.argmax(gaps))
    v0, v1 = s[k], s[k] + gaps[k]          # vacuum (unwrapped), v1 may exceed 1
    mid = 0.5 * (v0 + v1)
    lo = mid - eopreg / 2
    hi = lo + eopreg
    # keep the decreasing zone off the cell boundary
    if np.floor(lo) != np.floor(hi - 1e-12):
        b = np.floor(hi)                   # boundary inside the zone
        pad = 0.005
        cand = [(b - eopreg - pad, b - pad), (b + pad, b + pad + eopreg)]
        cand.sort(key=lambda r: -min(r[0] - v0, v1 - r[1]))
        lo, hi = cand[0]
    d_lo, d_hi = (lo - v0) * lz, (v1 - hi) * lz
    return lo % 1.0, d_lo, d_hi, (v0 % 1.0, v1 % 1.0, gaps[k] * lz)

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('relax_in'); ap.add_argument('relax_out', nargs='?')
    ap.add_argument('--eopreg', type=float, default=0.05)
    ap.add_argument('--clearance', type=float, default=6.0, help='min. A between the dipole zone and any atom')
    ap.add_argument('--emaxpos', type=float, default=None, help='override the automatic choice')
    ap.add_argument('--tag', default=None)
    ap.add_argument('--fix-below', type=float, default=None,
                    help='fix (0 0 0) every atom whose cartesian z (A) is below this value, '
                         'e.g. 11.0 freezes the bottom oxide trilayer of the builder geometry')
    ap.add_argument('--relax', action='store_true',
                    help='write a dipole-corrected RELAX instead of an scf (README step 3b)')
    a = ap.parse_args()
    if a.tag is None:
        a.tag = 'diprelax' if a.relax else 'dip'

    L = open(a.relax_in).read().splitlines()
    nat = int(get_value(L, 'nat'))
    prefix = get_value(L, 'prefix') or 'pwscf'
    outdir = get_value(L, 'outdir') or './'
    import os
    stem0 = os.path.basename(a.relax_in).rsplit('.', 1)[0]
    newprefix = f'{stem0}_{a.tag}'          # unique per interface, old data untouched
    C = cell_angstrom(L); lz = np.linalg.norm(C[2])

    ip = card_index(L, 'ATOMIC_POSITIONS')
    if a.relax_out:
        block, conv = read_final_positions(a.relax_out, nat)
    else:
        block, conv = L[ip:ip + 1 + nat], None
        print('NOTE: no relax output given -- using the coordinates of the template itself.')
    if a.fix_below is not None:
        hdr = block[0].lower(); newb = [block[0]]; nfix = 0
        for l in block[1:]:
            t = l.split(); xyz = np.array([float(q) for q in t[1:4]])
            zc = (xyz @ C)[2] if 'crystal' in hdr else xyz[2] * (BOHR if 'bohr' in hdr else 1.0)
            if zc < a.fix_below:
                newb.append(f"{t[0]:<5s}{t[1]:>16s}{t[2]:>16s}{t[3]:>16s}   0   0   0"); nfix += 1
            else:
                newb.append(f"{t[0]:<5s}{t[1]:>16s}{t[2]:>16s}{t[3]:>16s}")
        block = newb
        print(f'  fixed {nfix} atoms with z < {a.fix_below} A (flags 0 0 0)')
    fz = frac_z(block, C)
    emax, d_lo, d_hi, (v0, v1, w) = choose_emaxpos(fz, lz, a.eopreg, a.clearance)
    if a.emaxpos is not None:
        emax = a.emaxpos
    # ---------------------------------------------------------------- edit namelists
    out = []
    blocks = namelist_blocks(L)
    drop = set()
    for nm in (('CELL',) if a.relax else ('IONS', 'CELL')):
        if nm in blocks:
            s, e = blocks[nm]; drop.update(range(s, e + 1))
    remove_keys = re.compile(r'\s*(assume_isolated|tefield|dipfield|edir|emaxpos|eopreg|eamp|calculation|prefix|tprnfor)\s*=', re.I)
    cs, ce = blocks['CONTROL']; ss, se = blocks['SYSTEM']
    for i, l in enumerate(L):
        if i in drop:
            continue
        if i == ip:                                # replace the positions block
            out.extend(block); continue
        if ip < i <= ip + nat:
            continue
        if (cs < i < ce or ss < i < se) and remove_keys.match(l):
            continue
        if i == ce:
            out += [f"    calculation   = '{'relax' if a.relax else 'scf'}'",
                    f"    prefix        = '{newprefix}'",
                    "    tprnfor       = .true.",
                    "    tefield       = .true.      ! dipole correction",
                    "    dipfield      = .true."]
        if i == se:
            out += ["    edir          = 3",
                    f"    emaxpos       = {emax:.4f}    ! zone {emax:.4f}-{emax + a.eopreg:.4f}: inside the vacuum",
                    f"    eopreg        = {a.eopreg:.4f}",
                    "    eamp          = 0.0         ! no applied field, correction only"]
        out.append(l)
    if a.relax and 'IONS' not in blocks:
        ke = next(i for i, l in enumerate(out) if l.strip().upper().startswith('&ELECTRONS'))
        k = next(i for i in range(ke, len(out)) if out[i].strip() == '/') + 1
        out[k:k] = ['&IONS', "    ion_dynamics = 'bfgs'", '/']
    stem = a.relax_in.rsplit('.', 1)[0]
    fn = f"{stem}_{a.tag}.{'relax' if a.relax else 'scf'}.in"
    open(fn, 'w').write('\n'.join(out) + '\n')

    open(f'{stem}_{a.tag}.pp.in', 'w').write(
f"""&INPUTPP
   prefix   = '{newprefix}'
   outdir   = '{outdir}'
   filplot  = '{newprefix}.pot'
   plot_num = 11          ! V_bare + V_H; includes the dipole correction when dipfield=.true.
/
""")
    open(f'{stem}_{a.tag}.avg.in', 'w').write(
f"""1
{newprefix}.pot
1.0
1000
3
1.0
""")
    print(f'wrote {fn}, {stem}_{a.tag}.pp.in, {stem}_{a.tag}.avg.in')
    print(f'  cell height Lz = {lz:.3f} A ; vacuum frac {v0:.3f} -> {v1:.3f} ({w:.2f} A)')
    print(f'  dipole zone  emaxpos = {emax:.4f}, eopreg = {a.eopreg:.4f}')
    print(f'  distance from the zone to the nearest atoms: {d_lo:.2f} A and {d_hi:.2f} A')
    if min(d_lo, d_hi) < a.clearance:
        print(f'WARNING: less than {a.clearance} A clearance -- the zone may touch the electron density.\n'
              '         Shift it with --emaxpos, or give the cell a few A more vacuum.')
    if conv is False:
        print('WARNING: relax not finished (see above).')

if __name__ == '__main__':
    main()
