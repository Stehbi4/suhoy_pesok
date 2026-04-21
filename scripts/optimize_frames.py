"""Resize + convert PNG frames to WebP.
Usage: python scripts/optimize_frames.py <dir> [width=960] [quality=82]

Reads frame_*.png, writes frame_*.webp at given width (height auto).
Removes original PNGs after successful conversion.
"""
import sys, os
from pathlib import Path
from PIL import Image

src_dir  = Path(sys.argv[1])
width    = int(sys.argv[2]) if len(sys.argv) > 2 else 960
quality  = int(sys.argv[3]) if len(sys.argv) > 3 else 82

files = sorted(src_dir.glob('frame_*.png'))
if not files:
    print(f"No frame_*.png found in {src_dir}")
    sys.exit(1)

# Determine target height from first image
first = Image.open(files[0])
orig_w, orig_h = first.size
height = round(orig_h * width / orig_w)
first.close()

print(f"Optimizing {len(files)} frames: {orig_w}x{orig_h} -> {width}x{height}, WebP q={quality}")

total_in = total_out = 0
for i, f in enumerate(files):
    dest = f.with_suffix('.webp')
    in_size = f.stat().st_size

    img = Image.open(f).convert('RGBA')
    img = img.resize((width, height), Image.LANCZOS)
    img.save(dest, 'WEBP', quality=quality, method=4, lossless=False)
    img.close()

    out_size = dest.stat().st_size
    total_in  += in_size
    total_out += out_size
    ratio = (1 - out_size / in_size) * 100
    print(f"  [{i+1}/{len(files)}] {f.name} -> {dest.name}  {in_size//1024}KB -> {out_size//1024}KB  -{ratio:.0f}%")

    f.unlink()  # remove source PNG

total_mb = total_out // 1024 // 1024
avg_kb   = total_out // 1024 // max(len(files), 1)
print(f"\n=== Done ===")
print(f"Frames:    {len(files)}")
print(f"Total in:  {total_in//1024//1024} MB")
print(f"Total out: {total_out//1024} KB ({total_mb} MB)")
print(f"Avg frame: {avg_kb} KB")
print(f"Reduction: {(1 - total_out/total_in)*100:.0f}%")
if total_mb > 5:
    print(f"WARNING: {total_mb} MB > 5 MB — consider lower quality or smaller size")
