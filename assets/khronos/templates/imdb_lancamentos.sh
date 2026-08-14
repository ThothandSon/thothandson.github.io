#!/bin/bash
# NAME: Filmes e Series em Alta
OUTPUT="$HOME/KhronosScripts/logs/filmes_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Filmes em Alta — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -sf "https://www.imdb.com/chart/moviemeter/" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
  -H "Accept-Language: pt-BR,pt;q=0.9" \
  | python3 -c "
import sys, re, json
html = sys.stdin.read()
titles = []
for m in re.finditer(r'\"titleText\":\{\"text\":\"([^\"]+)\"', html):
    t = m.group(1)
    if t not in titles:
        titles.append(t)
if not titles:
    for m in re.finditer(r'<h3[^>]*>(\d+\.\s*[^<]+)</h3>', html):
        titles.append(m.group(1).strip())
for i, t in enumerate(titles[:20], 1):
    print(f'  {i:2d}. {t}')
if not titles:
    print('  Scraping bloqueado. Use TMDB (tmdb.org) para resultados confiaveis.')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
