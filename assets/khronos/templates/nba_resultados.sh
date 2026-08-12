# NAME: NBA — Resultados do Dia
#!/bin/bash
OUTPUT="$HOME/KhronosScripts/logs/nba_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
TODAY=$(date +%Y-%m-%d)
echo "=== NBA — $TODAY ===" > "$OUTPUT"
curl -s "https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json" \
  | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    games = data.get('scoreboard', {}).get('games', [])
    if not games:
        print('Nenhum jogo NBA hoje.')
    for g in games:
        home = g['homeTeam']['teamTricode']
        away = g['awayTeam']['teamTricode']
        hs = g['homeTeam']['score']
        as_ = g['awayTeam']['score']
        status = g.get('gameStatusText', '')
        print(f'  {away} {as_} x {hs} {home}  [{status}]')
except Exception as e:
    print(f'Erro: {e}')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Relatório salvo em $OUTPUT"
cat "$OUTPUT"
