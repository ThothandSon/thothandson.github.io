#!/bin/bash
# NAME: NBA — Resultados
OUTPUT="$HOME/KhronosScripts/logs/nba_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== NBA — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -sf "https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json" \
  -H "User-Agent: Mozilla/5.0" \
  | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    games = data.get('scoreboard', {}).get('games', [])
    if not games:
        print('  Nenhum jogo NBA hoje.')
    for g in games:
        home = g['homeTeam']['teamTricode']
        away = g['awayTeam']['teamTricode']
        hs = g['homeTeam']['score']
        avs = g['awayTeam']['score']
        status = g.get('gameStatusText', '')
        print(f'  {away} {avs} x {hs} {home}  [{status}]')
except Exception:
    print('  API da NBA indisponivel no momento.')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
