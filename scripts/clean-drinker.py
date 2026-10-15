"""Czyści klatki postaci z handoffu (assets-src/drinker -> src/assets/drinker).

Usuwa białą obwódkę po wycinaniu tła, resztki sąsiednich kadrów, wygładza krawędzie,
miękko wygasza krawędzie ucięte przez kadr i wyrównuje głowę do jednego punktu.
Uruchom: python3 scripts/clean-drinker.py   (wymaga numpy i Pillow)
"""
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

W, H = 300, 314
AX, AY = 145, 8
ANCHORS = {0: (73, 0), 1: (143, 3), 2: (118.5, 4), 3: (106, 0), 4: (92, 1), 5: (116, 2)}
FADE = 18  # px wygaszania na krawędziach ściętych kadrem


def shift(m, dy, dx):
    if m.ndim == 3:
        return np.stack([shift(m[:, :, c], dy, dx) for c in range(m.shape[2])], axis=2)
    out = np.zeros_like(m)
    h, w = m.shape
    ys, yd = (slice(0, h - dy), slice(dy, h)) if dy >= 0 else (slice(-dy, h), slice(0, h + dy))
    xs, xd = (slice(0, w - dx), slice(dx, w)) if dx >= 0 else (slice(-dx, w), slice(0, w + dx))
    out[yd, xd] = m[ys, xs]
    return out


def erode(m, r=1):
    for _ in range(r):
        m = m & shift(m, 1, 0) & shift(m, -1, 0) & shift(m, 0, 1) & shift(m, 0, -1)
    return m


def dilate(m, r=1):
    for _ in range(r):
        m = m | shift(m, 1, 0) | shift(m, -1, 0) | shift(m, 0, 1) | shift(m, 0, -1)
    return m


def label(mask):
    h, w = mask.shape
    lab = np.zeros((h, w), int)
    sizes = [0]
    n = 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not lab[y, x]:
                n += 1
                q = deque([(y, x)])
                lab[y, x] = n
                c = 0
                while q:
                    cy, cx = q.popleft()
                    c += 1
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n
                            q.append((ny, nx))
                sizes.append(c)
    return lab, sizes


def keep_main(mask):
    lab, sizes = label(mask)
    big = max(sizes)
    keep = np.zeros_like(mask)
    for k in range(1, len(sizes)):
        if sizes[k] >= 0.05 * big:
            keep |= lab == k
    return keep


def fill_holes(mask):
    """Wypełnia dziury, do których nie dochodzi tło z zewnątrz."""
    outside = ~mask
    lab, sizes = label(outside)
    border = set(lab[0].tolist()) | set(lab[-1].tolist()) | set(lab[:, 0].tolist()) | set(lab[:, -1].tolist())
    holes = np.zeros_like(mask)
    for k in range(1, len(sizes)):
        # tylko drobne dziurki; duże prześwity (np. między ręką a barkiem) to prawdziwe tło
        if k not in border and sizes[k] <= 120:
            holes |= lab == k
    return mask | holes, holes


def clean(a, pose):
    rgb = a[:, :, :3].astype(float)
    m = a[:, :, 3] > 128
    m = keep_main(m)

    # jasna, prawie bezbarwna obwódka przy krawędzi (resztki szachownicy)
    lum = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    light = (lum > 150) & (chroma < 38)
    for _ in range(3):
        band = m & ~erode(m, 3)
        m = m & ~(band & light)
        m = keep_main(m)
    m, holes = fill_holes(m)

    # kolory pikseli brzegowych: z wnętrza, żeby nie świeciła stara obwódka
    inner = erode(m, 2)
    filled = rgb.copy()
    have = inner.copy()
    for _ in range(4):
        acc = np.zeros_like(filled)
        cnt = np.zeros(m.shape)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0:
                    continue
                hv = shift(have, dy, dx)
                acc += np.where(hv[..., None], shift(filled, dy, dx), 0)
                cnt += hv
        grow = (~have) & (cnt > 0) & m
        filled[grow] = acc[grow] / cnt[grow][:, None]
        have = have | grow
    rgb = np.where(inner[..., None], rgb, filled)
    holes_d = holes
    if holes_d.any():
        rgb[holes_d] = filled[holes_d]

    # miękka krawędź: lekka erozja i rozmycie alfa
    alpha = erode(m, 1).astype(np.uint8) * 255
    alpha_img = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.9))
    alpha = np.array(alpha_img).astype(float)

    # wygaszanie krawędzi ściętych przez kadr
    h, w = m.shape
    def cut(col_or_row):
        return col_or_row.sum() >= 15
    ramp = np.linspace(0, 1, FADE)
    if cut(m[:, 0]):
        alpha[:, :FADE] *= ramp[None, :] ** 1.3
    if cut(m[:, -1]):
        alpha[:, -FADE:] *= ramp[::-1][None, :] ** 1.3
    out = np.dstack([np.clip(rgb, 0, 255), alpha]).astype(np.uint8)
    return out


for i in range(6):
    a = np.array(Image.open(f'assets-src/drinker/pose_0{i}.png').convert('RGBA'))
    if i == 0:
        a = a[:296]
    a = clean(a, i)
    ax, ay = ANCHORS[i]
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(Image.fromarray(a), (int(round(AX - ax)), int(round(AY - ay))))
    canvas.save(f'src/assets/drinker/pose_0{i}.png', optimize=True)
    print('pose', i, 'ok')
