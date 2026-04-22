"""
Background removal pipeline for Chahine Seafood project.

Takes phone-shot food photography (busy backgrounds, uncontrolled lighting)
and produces clean cutout PNGs on transparent backgrounds, ready to be
placed onto the deep-navy brand background.

Uses U2Netp — the same salient-object model that rembg wraps, but called
directly via onnxruntime to avoid the rembg dependency chain.
"""

from pathlib import Path
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter, ImageFile

# Be forgiving with truncated / partially-downloaded JPEGs from Instagram/CDN.
ImageFile.LOAD_TRUNCATED_IMAGES = True

MODEL_PATH = Path.home() / ".cache" / "models" / "u2netp.onnx"
IN_DIR = Path("/sessions/determined-keen-noether/mnt/outputs/imagery/raw")
OUT_DIR = Path("/sessions/determined-keen-noether/mnt/outputs/imagery/cutouts")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# deep ocean navy background to preview cutouts against the brand palette
BRAND_BG = (10, 31, 51)  # #0A1F33

# U2Net preprocessing params (standard ImageNet-ish normalization)
INPUT_SIZE = 320
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def load_session():
    return ort.InferenceSession(
        str(MODEL_PATH), providers=["CPUExecutionProvider"]
    )


def predict_mask(session, img: Image.Image) -> Image.Image:
    """Run U2Netp and return a float mask at the original image size."""
    orig_w, orig_h = img.size
    rgb = img.convert("RGB").resize((INPUT_SIZE, INPUT_SIZE), Image.BILINEAR)
    arr = np.asarray(rgb, dtype=np.float32) / 255.0
    arr = (arr - MEAN) / STD
    # HWC -> CHW, add batch
    arr = arr.transpose(2, 0, 1)[None, ...].astype(np.float32)

    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: arr})
    # U2Net returns 7 side outputs + the fused one; first is the main prediction
    pred = outputs[0][0, 0]  # (H, W)
    # normalize 0..1
    pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)

    mask = Image.fromarray((pred * 255).astype(np.uint8), mode="L")
    mask = mask.resize((orig_w, orig_h), Image.BILINEAR)
    # soften the alpha edge so the cutout doesn't look "stamped"
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))
    return mask


def compose_cutout(img: Image.Image, mask: Image.Image) -> Image.Image:
    """Apply the mask as alpha -> RGBA."""
    rgba = img.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def compose_preview_on_brand(rgba: Image.Image) -> Image.Image:
    """Flatten the cutout onto the brand's deep-navy BG at a fixed width
    so we can judge how it'll actually look on the site."""
    target_w = 900
    ratio = target_w / rgba.width
    target_h = int(rgba.height * ratio)
    resized = rgba.resize((target_w, target_h), Image.LANCZOS)

    bg = Image.new("RGB", (target_w, target_h), BRAND_BG)
    bg.paste(resized, (0, 0), resized)
    return bg


def process_file(session, in_path: Path):
    name = in_path.stem
    img = Image.open(in_path).convert("RGBA")

    mask = predict_mask(session, img)
    cutout = compose_cutout(img, mask)
    cutout.save(OUT_DIR / f"{name}_cutout.png", "PNG")

    preview = compose_preview_on_brand(cutout)
    preview.save(OUT_DIR / f"{name}_on_brand.jpg", "JPEG", quality=88)

    mask.save(OUT_DIR / f"{name}_mask.png", "PNG")

    print(f"  {name}: mask+cutout+preview -> {OUT_DIR}")


def main():
    session = load_session()
    inputs = sorted(p for p in IN_DIR.glob("*.jpg") if p.stat().st_size > 1000)
    if not inputs:
        print(f"No usable inputs in {IN_DIR}")
        return
    print(f"Processing {len(inputs)} image(s) with u2netp...")
    for p in inputs:
        try:
            process_file(session, p)
        except Exception as e:
            print(f"  {p.name}: FAILED -> {e}")
    print("Done.")


if __name__ == "__main__":
    main()
