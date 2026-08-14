#!/bin/bash
# NAME: Noticias do Brasil
OUTPUT="$HOME/KhronosScripts/logs/noticias_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Noticias — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
curl -sf "https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419" \
  -H "User-Agent: Mozilla/5.0" \
  | python3 -c "
import sys, re, html
xml = sys.stdin.read()
titles = re.findall(r'<title>(.*?)</title>', xml)
for t in titles[2:22]:
    t = html.unescape(t).strip()
    src = ''
    m = re.search(r' - ([^-]+)$', t)
    if m:
        src = m.group(1).strip()
        t = t[:m.start()].strip()
    line = f'  {t}'
    if src:
        line += f'  [{src}]'
    print(line)
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
