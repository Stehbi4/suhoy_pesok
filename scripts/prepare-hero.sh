#!/usr/bin/env bash
# Usage: ./scripts/prepare-hero.sh <video.mp4> <output_dir> [fps=30]
#
# Deps: ffmpeg, rembg (pip install rembg[gpu]), pngquant
# Output: frame_0001.png … frame_NNNN.png in <output_dir>

set -euo pipefail

VIDEO="${1:?Usage: $0 <video.mp4> <output_dir> [fps=30]}"
OUTPUT_DIR="${2:?Usage: $0 <video.mp4> <output_dir> [fps=30]}"
FPS="${3:-30}"

WARN_MB=5

for cmd in ffmpeg rembg pngquant; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: '$cmd' not found. Install it first." >&2
    exit 1
  fi
done

TMP_RAW="$(mktemp -d)"
TMP_NOBG="$(mktemp -d)"
trap 'rm -rf "$TMP_RAW" "$TMP_NOBG"' EXIT

mkdir -p "$OUTPUT_DIR"

echo "=== Step 1: Extracting frames at ${FPS} fps ==="
ffmpeg -i "$VIDEO" -vf "fps=${FPS}" -pix_fmt rgba \
  "$TMP_RAW/frame_%04d.png" -loglevel warning

FRAME_COUNT=$(ls "$TMP_RAW"/frame_*.png 2>/dev/null | wc -l)
if [ "$FRAME_COUNT" -eq 0 ]; then
  echo "ERROR: ffmpeg produced no frames." >&2; exit 1
fi
echo "Extracted $FRAME_COUNT frames"

echo "=== Step 2: Removing backgrounds (rembg) — this may take a while ==="
for f in "$TMP_RAW"/frame_*.png; do
  rembg i "$f" "$TMP_NOBG/$(basename "$f")"
done
echo "Background removal done"

echo "=== Step 3: Optimizing with pngquant (quality 65-80) ==="
for f in "$TMP_NOBG"/frame_*.png; do
  name="$(basename "$f")"
  pngquant --quality 65-80 --force --skip-if-larger \
    --output "$OUTPUT_DIR/$name" "$f"
  # pngquant skips if larger; copy original as fallback
  [ -f "$OUTPUT_DIR/$name" ] || cp "$f" "$OUTPUT_DIR/$name"
done
echo "Optimization done"

echo ""
echo "=== Stats ==="
FINAL_COUNT=$(ls "$OUTPUT_DIR"/frame_*.png 2>/dev/null | wc -l)
TOTAL_BYTES=$(du -sb "$OUTPUT_DIR" | cut -f1)
TOTAL_KB=$((TOTAL_BYTES / 1024))
TOTAL_MB=$((TOTAL_BYTES / 1024 / 1024))
AVG_KB=$((TOTAL_KB / FINAL_COUNT))

echo "Frames:          $FINAL_COUNT"
printf "Total size:      %d KB (~%d MB)\n" "$TOTAL_KB" "$TOTAL_MB"
printf "Avg frame size:  ~%d KB\n" "$AVG_KB"
printf "Duration:        ~%.1f s at %s fps\n" "$(echo "scale=1; $FINAL_COUNT / $FPS" | bc)" "$FPS"

if [ "$TOTAL_MB" -gt "$WARN_MB" ]; then
  echo ""
  echo "⚠  WARNING: total size ${TOTAL_MB}MB exceeds ${WARN_MB}MB threshold."
  echo "   Consider reducing fps (e.g. 24) or frame resolution."
  echo "   Run: ffmpeg -i input.mp4 -vf \"fps=24,scale=960:-2\" frames/%04d.png"
fi

echo ""
echo "Done → $OUTPUT_DIR"
echo ""
echo "Update HeroSection constants:"
echo "  const ANIM_FPS     = $FPS;"
echo "  const ANIM1_FRAMES = $FINAL_COUNT;   // for this video"
