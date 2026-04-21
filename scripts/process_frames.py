"""Remove background from raw frames, then optimize with Pillow.
Usage: python scripts/process_frames.py <input_dir> <output_dir>
"""
import sys, os, time
from pathlib import Path

input_dir  = Path(sys.argv[1])
output_dir = Path(sys.argv[2])
output_dir.mkdir(parents=True, exist_ok=True)

files = sorted(input_dir.glob('raw_*.png'))
total = len(files)
print(f"Processing {total} frames: {input_dir} -> {output_dir}")

from rembg import remove, new_session
session = new_session()  # load model once

start = time.time()
for i, src in enumerate(files):
    dest_name = src.name.replace('raw_', 'frame_')
    dest = output_dir / dest_name

    if dest.exists():
        print(f"  [{i+1}/{total}] skip (exists): {dest_name}")
        continue

    t0 = time.time()
    data = src.read_bytes()
    out  = remove(data, session=session)
    dest.write_bytes(out)

    elapsed = time.time() - t0
    eta = (total - i - 1) * elapsed
    print(f"  [{i+1}/{total}] {dest_name}  {len(out)//1024}KB  {elapsed:.1f}s  ETA {eta:.0f}s")

elapsed_total = time.time() - start
total_kb = sum(f.stat().st_size for f in output_dir.glob('frame_*.png')) // 1024
avg_kb   = total_kb // max(total, 1)
print(f"\n=== Done ===")
print(f"Frames:    {total}")
print(f"Total:     {total_kb} KB ({total_kb//1024} MB)")
print(f"Avg frame: {avg_kb} KB")
print(f"Time:      {elapsed_total/60:.1f} min")
if total_kb // 1024 > 5:
    print(f"WARNING: {total_kb//1024} MB > 5 MB threshold")
print(f"\nUpdate HeroSection.tsx -> ANIM1_FRAMES or ANIM2_FRAMES = {total}")
