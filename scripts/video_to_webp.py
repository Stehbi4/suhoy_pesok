"""Extract frames from video and convert to WebP (no background removal).
Usage: python scripts/video_to_webp.py <video> <output_dir> [fps=24] [width=960] [quality=85]
"""
import sys, os, subprocess, tempfile, time
from pathlib import Path
from PIL import Image

video      = sys.argv[1]
output_dir = Path(sys.argv[2])
fps        = int(sys.argv[3])   if len(sys.argv) > 3 else 24
width      = int(sys.argv[4])   if len(sys.argv) > 4 else 960
quality    = int(sys.argv[5])   if len(sys.argv) > 5 else 85

output_dir.mkdir(parents=True, exist_ok=True)
tmp = Path(tempfile.mkdtemp())

print(f"Extracting {fps}fps from {video} ...")
subprocess.run([
    'ffmpeg', '-i', video,
    '-vf', f'fps={fps},scale={width}:-2',
    str(tmp / 'frame_%04d.png'),
    '-loglevel', 'warning'
], check=True)

pngs = sorted(tmp.glob('frame_*.png'))
print(f"Converting {len(pngs)} frames to WebP q={quality} ...")

t0 = time.time()
total_bytes = 0
for i, src in enumerate(pngs):
    dest = output_dir / src.name.replace('.png', '.webp')
    img  = Image.open(src).convert('RGB')
    img.save(dest, 'WEBP', quality=quality, method=4)
    img.close()
    src.unlink()
    total_bytes += dest.stat().st_size
    if (i + 1) % 10 == 0 or i == len(pngs) - 1:
        print(f"  {i+1}/{len(pngs)}  avg {total_bytes//(i+1)//1024} KB/frame")

elapsed = time.time() - t0
total_kb = total_bytes // 1024
print(f"\nDone: {len(pngs)} frames, {total_kb} KB total ({total_kb//1024} MB), {elapsed:.1f}s")
if total_kb // 1024 > 5:
    print(f"WARNING: {total_kb//1024} MB > 5 MB")
print(f"Set ANIM_FPS={fps}, frames={len(pngs)}")
