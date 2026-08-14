#!/bin/bash
# NAME: Previsao do Tempo
CITY="${KHRONOS_CITY:-São Paulo}"
OUTPUT="$HOME/KhronosScripts/logs/clima_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Clima — $CITY — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -sf "wttr.in/$(echo "$CITY" | sed 's/ /+/g')?format=4&lang=pt" >> "$OUTPUT"
echo "" >> "$OUTPUT"
curl -sf "wttr.in/$(echo "$CITY" | sed 's/ /+/g')?T&lang=pt" \
  | head -37 >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
