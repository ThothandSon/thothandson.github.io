#!/bin/bash
# NAME: Bolsa B3 — Acoes do Dia
OUTPUT="$HOME/KhronosScripts/logs/bolsa_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== B3 — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
python3 << 'PYEOF' >> "$OUTPUT"
import json, urllib.request, os

tickers = os.environ.get('KHRONOS_TICKERS', 'PETR4,VALE3,ITUB4')
parts = [t.strip() for t in tickers.split(',')]

import time
for batch_start in range(0, len(parts), 3):
    if batch_start > 0:
        time.sleep(2)
    batch = ','.join(parts[batch_start:batch_start+3])
    url = f'https://brapi.dev/api/quote/{batch}?token=demo'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode())
        for r in data.get('results', []):
            sym = r.get('symbol', '?')
            price = r.get('regularMarketPrice', 0)
            chg = r.get('regularMarketChangePercent', 0)
            arrow = '+' if chg >= 0 else ''
            name = r.get('shortName', '')[:30]
            print(f'  {sym:8s} R$ {price:8.2f}  {arrow}{chg:.2f}%  {name}')
    except Exception as e:
        print(f'  Erro ao buscar {batch}: {e}')
PYEOF
echo "" >> "$OUTPUT"
cat "$OUTPUT"
