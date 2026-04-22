"""
Atmospheric-asset generator for Chahine Seafood.

Runs in the dev environment to produce the supporting visual textures that
sit behind the brand content. Outputs go into `public/textures/` and are
committed to the repo (small enough and deterministic so diffs are
meaningful).

Currently produces:
    public/textures/gold-dust.png    — faint gold-speck overlay (1600x1600)

Re-run with `python3 imagery-pipeline/atmospheric.py` whenever the params
below are tuned. A fixed seed keeps runs reproducible.
"""

import random
from pathlib import Path

from PIL import Image, ImageDraw

REPO_ROOT = Path(__file__).resolve().parent.parent
TEXTURES = REPO_ROOT / "public" / "textures"
TEXTURES.mkdir(parents=True, exist_ok=True)

SEED = 42


def generate_gold_dust(path: Path, size: int = 1600, count: int = 140) -> None:
    """Scatter small gold specks on a transparent canvas.

    Density biases toward the lower third so the texture naturally sits
    under product photography rather than above it.
    """
    random.seed(SEED)

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    gold_palette = [
        (227, 178, 60),   # --cs-gold
        (245, 215, 122),  # --cs-gold-soft
        (255, 231, 163),  # warm highlight
    ]

    for _ in range(count):
        # Bias Y downward: pow < 1 skews toward max, so 0.6 gives a pleasant
        # denser-at-bottom distribution without being too heavy-handed.
        y_norm = random.random() ** 0.6
        x = random.randint(0, size - 1)
        y = int(y_norm * (size - 1))
        r = random.randint(1, 3)
        rgb = random.choice(gold_palette)
        alpha = random.randint(180, 240)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=rgb + (alpha,))

    img.save(path, "PNG", optimize=True)
    print(f"  wrote {path} ({path.stat().st_size // 1024} KB)")


def main() -> None:
    print("Generating atmospheric assets...")
    generate_gold_dust(TEXTURES / "gold-dust.png")
    print("Done.")


if __name__ == "__main__":
    main()
