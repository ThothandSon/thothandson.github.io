#!/bin/bash
# NAME: Crypto — Bitcoin, Ethereum e Solana
OUTPUT="$HOME/KhronosScripts/logs/crypto_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Crypto — $(date '+%d/%m/%Y %H:%M') ===" > "$OUTPUT"
curl -sf "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=brl,usd&include_24hr_change=true" \
  | python3 -c "
import json, sys
names = {'bitcoin': 'BTC', 'ethereum': 'ETH', 'solana': 'SOL', 'binancecoin': 'BNB'}
data = json.load(sys.stdin)
for coin_id, label in names.items():
    v = data.get(coin_id, {})
    brl = v.get('brl', 0)
    usd = v.get('usd', 0)
    chg = v.get('brl_24h_change', 0)
    arrow = '+' if chg >= 0 else ''
    print(f'  {label:4s}  R\$ {brl:>12,.2f}  (US\$ {usd:>10,.2f})  {arrow}{chg:.1f}%')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
