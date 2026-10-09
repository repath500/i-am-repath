#!/usr/bin/env bash
# Turns public/story/raw/* into web-ready files in public/story/.
#   npm run story:optimize
# Requires ffmpeg (with libvpx-vp9, libaom-av1 or libsvtav1, libwebp).
set -euo pipefail

RAW=public/story/raw
OUT=public/story
KEY="0x00B140"
mkdir -p "$OUT/img" "$OUT/video" "$OUT/sprites" "$OUT/poster"

shopt -s nullglob

for src in "$RAW"/img/*.png; do
  id=$(basename "$src" .png)
  case "$id" in
    mp-quay-0-*|sc*|ui-chapter-*|ui-og|char-*)
      ffmpeg -v error -y -i "$src" -vf "scale='min(2560,iw)':-2" -c:v libwebp -quality 82 "$OUT/img/$id.webp"
      ffmpeg -v error -y -i "$src" -vf "scale='min(2560,iw)':-2" -c:v libaom-av1 -still-picture 1 -crf 30 "$OUT/img/$id.avif" 2>/dev/null || true
      ;;
    mp-quay-*|ui-title-lettering|sprite-*)
      # green-screen layers → transparent WebP
      ffmpeg -v error -y -i "$src" \
        -vf "chromakey=$KEY:0.12:0.08,despill=type=green,scale='min(2560,iw)':-2,format=yuva420p" \
        -c:v libwebp -quality 85 -lossless 0 "$OUT/img/$id.webp"
      ;;
    *)
      ffmpeg -v error -y -i "$src" -c:v libwebp -quality 85 "$OUT/img/$id.webp"
      ;;
  esac
  echo "img  $id"
done

for src in "$RAW"/video/*.mp4; do
  id=$(basename "$src" .mp4)
  if [[ "$id" == v-sprite-* ]]; then
    # chroma-keyed sprite loops: VP9 alpha for Chrome/Firefox, HEVC alpha has to be made on macOS for Safari
    ffmpeg -v error -y -i "$src" -an \
      -vf "chromakey=$KEY:0.12:0.08,despill=type=green,scale=360:-2,fps=12,format=yuva420p" \
      -c:v libvpx-vp9 -b:v 0 -crf 34 -auto-alt-ref 0 "$OUT/sprites/$id.webm"
    ffmpeg -v error -y -i "$src" -vf "chromakey=$KEY:0.12:0.08,despill=type=green,scale=360:-2,fps=12" \
      -frames:v 1 "$OUT/sprites/$id.png"
    echo "sprite $id"
    continue
  fi

  audio=(-an)
  if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$src" | grep -q .; then
    audio=(-c:a aac -b:a 96k)
  fi

  ffmpeg -v error -y -i "$src" "${audio[@]}" -vf "scale='min(1280,iw)':-2" \
    -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/video/$id.mp4"
  ffmpeg -v error -y -i "$src" -an -vf "scale='min(1280,iw)':-2" \
    -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$OUT/video/$id.webm"
  ffmpeg -v error -y -i "$src" -frames:v 1 -vf "scale='min(1280,iw)':-2" -c:v libwebp -quality 80 "$OUT/poster/$id.webp"
  echo "video $id"
done

du -sh "$OUT"/img "$OUT"/video "$OUT"/sprites "$OUT"/poster 2>/dev/null || true
