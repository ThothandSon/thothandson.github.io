#!/bin/bash
# NAME: Horoscopo do Dia
SIGNO="${KHRONOS_SIGNO:-aries}"
OUTPUT="$HOME/KhronosScripts/logs/horoscopo_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Horoscopo — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
python3 -c "
import json, urllib.request

signos = {
    'aries': 'Aries', 'taurus': 'Touro', 'gemini': 'Gemeos',
    'cancer': 'Cancer', 'leo': 'Leao', 'virgo': 'Virgem',
    'libra': 'Libra', 'scorpio': 'Escorpiao', 'sagittarius': 'Sagitario',
    'capricorn': 'Capricornio', 'aquarius': 'Aquario', 'pisces': 'Peixes'
}
signo = '${SIGNO}'.lower()
nome = signos.get(signo, signo.capitalize())
try:
    url = f'https://ohmanda.com/api/horoscope/{signo}/'
    req = urllib.request.Request(url, headers={'User-Agent': 'Khronos/1.0'})
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
    text = data.get('horoscope', 'Indisponivel')
    print(f'  {nome}:')
    print()
    words = text.split()
    line = '  '
    for w in words:
        if len(line) + len(w) > 70:
            print(line)
            line = '  '
        line += w + ' '
    if line.strip():
        print(line)
except Exception as e:
    print(f'  Erro: {e}')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Configure seu signo: export KHRONOS_SIGNO=leo" >> "$OUTPUT"
cat "$OUTPUT"
