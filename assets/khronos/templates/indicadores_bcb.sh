#!/bin/bash
# NAME: SELIC, IPCA e CDI — Banco Central
OUTPUT="$HOME/KhronosScripts/logs/indicadores_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Indicadores Economicos — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
python3 -c "
import json, urllib.request

def bcb(serie, nome):
    url = f'https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie}/dados/ultimos/1?formato=json'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Khronos/1.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode())
        return f'  {nome}: {d[0][\"valor\"]}%  (ref: {d[0][\"data\"]})'
    except Exception as e:
        return f'  {nome}: indisponivel ({e})'

print(bcb(432, 'SELIC Meta'))
print(bcb(4189, 'SELIC Over'))
print(bcb(433, 'IPCA Mensal'))
print(bcb(4391, 'CDI'))
print(bcb(1, 'Dolar PTAX'))
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
