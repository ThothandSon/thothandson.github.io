#!/bin/bash
# NAME: Ofertas e Promocoes
OUTPUT="$HOME/KhronosScripts/logs/ofertas_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Ofertas — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
python3 -c "
import urllib.request, re, html

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
req = urllib.request.Request('https://www.promobit.com.br/ofertas', headers=headers)
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        page = r.read().decode('utf-8', errors='ignore')
except Exception as e:
    print(f'  Erro: {e}')
    exit(0)

titles = re.findall(r'\"name\":\"([^\"]{10,})\"', page)
seen = set()
n = 0
skip = {'Mercado Livre', 'Amazon', 'Shopee', 'Magazine Luiza', 'Americanas'}
for t in titles:
    t = html.unescape(t).strip()
    if t in seen or t in skip or 'Promobit' in t or len(t) < 15:
        continue
    seen.add(t)
    n += 1
    print(f'  {n:2d}. {t}')
    if n >= 15:
        break
if n == 0:
    print('  Nenhuma oferta encontrada.')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
