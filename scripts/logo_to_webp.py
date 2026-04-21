"""Extract RGB frames from the logo video and write them as WebP.

No colorkey / no alpha tricks — logo keeps its exact colors. Blend with the
host section by setting the section background to the logo video's bg color
(sample frame_0001 corner with scripts/sample_bg_color.py).

Usage: python scripts/logo_to_webp.py <video> <output_dir> [fps=24] [width=480] [quality=80]
"""
import sys, subprocess, tempfile, time
from pathlib import Path
from PIL import Image

video      = sys.argv[1]
output_dir = Path(sys.argv[2])
fps        = int(sys.argv[3]) if len(sys.argv) > 3 else 24
width      = int(sys.argv[4]) if len(sys.argv) > 4 else 480
quality    = int(sys.argv[5]) if len(sys.argv) > 5 else 80

output_dir.mkdir(parents=True, exist_ok=True)
tmp = Path(tempfile.mkdtemp())

print(f"Extracting {fps}fps from {video} (RGB, no alpha) ...")
subprocess.run([
    'ffmpeg', '-y',
    '-i', video,
    '-vf', f'fps={fps},scale={width}:-2:flags=lanczos',
    str(tmp / 'frame_%04d.png'),
    '-loglevel', 'warning',
], check=True)

pngs = sorted(tmp.glob('frame_*.png'))
print(f"Converting {len(pngs)} frames to WebP (RGB) q={quality} ...")

t0 = time.time()
total_bytes = 0
bg_samples = []   # collect corner colors from first frame to report section bg
for i, src in enumerate(pngs):
    dest = output_dir / src.name.replace('.png', '.webp')
    img  = Image.open(src).convert('RGB')
    if i == 0:
        w, h = img.size
        for (x, y) in [(2,2),(w-3,2),(2,h-3),(w-3,h-3)]:
            bg_samples.append(img.getpixel((x, y)))
    img.save(dest, 'WEBP', quality=quality, method=6)
    img.close()
    src.unlink()
    total_bytes += dest.stat().st_size
    if (i + 1) % 20 == 0 or i == len(pngs) - 1:
        print(f"  {i+1}/{len(pngs)}  avg {total_bytes//(i+1)//1024} KB/frame")

elapsed = time.time() - t0
total_kb = total_bytes // 1024

# Average the corner samples → canonical bg color for the section
r = sum(p[0] for p in bg_samples) // len(bg_samples)
g = sum(p[1] for p in bg_samples) // len(bg_samples)
b = sum(p[2] for p in bg_samples) // len(bg_samples)
print(f"\nDone: {len(pngs)} frames, {total_kb} KB total ({total_kb/1024:.1f} MB), {elapsed:.1f}s")
print(f"Set LOGO_FPS={fps}, LOGO_FRAMES={len(pngs)}")
print(f"Logo background color (avg of 4 corners, frame 1): #{r:02x}{g:02x}{b:02x}  rgb({r},{g},{b})")
print(f"Use this as the section bg to seamlessly blend the logo canvas.")
