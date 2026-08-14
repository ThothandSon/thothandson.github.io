#!/bin/bash
# NAME: Cotacao Dolar e Bitcoin
OUTPUT="$HOME/KhronosScripts/logs/cotacao_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Cotacoes — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
curl -sf "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
for key, v in data.items():
    nome = v['name']
    compra = float(v['bid'])
    venda = float(v['ask'])
    var = v.get('pctChange', '0')
    print(f'  {nome}: R\$ {compra:.2f} (compra) / R\$ {venda:.2f} (venda) | var: {var}%')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
