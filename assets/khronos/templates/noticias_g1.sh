# NAME: Raspar G1 — Principais Notícias
#!/bin/bash
OUTPUT="$HOME/KhronosScripts/logs/g1_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== G1 — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
curl -s "https://g1.globo.com/" \
  | grep -oP '(?<=<a[^>]*class="[^"]*feed-post-link[^"]*"[^>]*href=")[^"]+' \
  | head -15 \
  | while read -r url; do
      title=$(curl -s "$url" | grep -oP '(?<=<title>)[^<]+' | head -1)
      [ -n "$title" ] && echo "• $title" >> "$OUTPUT"
    done
echo "" >> "$OUTPUT"
echo "Relatório salvo em $OUTPUT"
cat "$OUTPUT"
