# NAME: Cotação Dólar e Bitcoin
#!/bin/bash
OUTPUT="$HOME/KhronosScripts/logs/cotacao_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Cotações — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
curl -s "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL" \
  | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for key, v in data.items():
        nome = v['name']
        compra = float(v['bid'])
        venda = float(v['ask'])
        var = v.get('pctChange', '0')
        print(f'  {nome}: R\$ {compra:.2f} (compra) / R\$ {venda:.2f} (venda) | var: {var}%')
except Exception as e:
    print(f'Erro: {e}')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Relatório salvo em $OUTPUT"
cat "$OUTPUT"
