#!/bin/bash
# NAME: Futebol — Jogos de Hoje
OUTPUT="$HOME/KhronosScripts/logs/futebol_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
TODAY=$(date +%Y-%m-%d)
echo "=== Futebol — $TODAY ===" > "$OUTPUT"
curl -sf "https://api.football-data.org/v4/matches?dateFrom=$TODAY&dateTo=$TODAY" \
  -H "X-Auth-Token: ${FOOTBALL_API_KEY:-}" 2>/dev/null \
  | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    matches = data.get('matches', [])
    if not matches:
        print('  Nenhum jogo encontrado.')
        print('  Dica: cadastre-se gratis em football-data.org e')
        print('  exporte FOOTBALL_API_KEY=sua_chave')
        sys.exit(0)
    for m in matches[:20]:
        home = m['homeTeam']['name']
        away = m['awayTeam']['name']
        comp = m['competition']['name']
        status = m['status']
        ft = m.get('score', {}).get('fullTime', {})
        score = ''
        if ft.get('home') is not None:
            score = f' {ft[\"home\"]}x{ft[\"away\"]}'
        print(f'  {comp}: {home} vs {away}{score} [{status}]')
except Exception:
    print('  API indisponivel. Configure FOOTBALL_API_KEY (gratis em football-data.org)')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
