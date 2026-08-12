# NAME: Futebol — Jogos de Hoje
#!/bin/bash
OUTPUT="$HOME/KhronosScripts/logs/futebol_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
TODAY=$(date +%Y-%m-%d)
echo "=== Futebol — Jogos de $TODAY ===" > "$OUTPUT"
curl -s "https://api.football-data.org/v4/matches?dateFrom=$TODAY&dateTo=$TODAY" \
  -H "X-Auth-Token: ${FOOTBALL_API_KEY:-test}" 2>/dev/null \
  | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    matches = data.get('matches', [])
    if not matches:
        print('Nenhum jogo encontrado hoje.')
    for m in matches[:20]:
        home = m['homeTeam']['name']
        away = m['awayTeam']['name']
        comp = m['competition']['name']
        status = m['status']
        score = ''
        if m.get('score', {}).get('fullTime', {}).get('home') is not None:
            score = f\" {m['score']['fullTime']['home']}x{m['score']['fullTime']['away']}\"
        print(f'  {comp}: {home} vs {away}{score} [{status}]')
except Exception as e:
    print(f'Erro ao processar: {e}')
    print('Dica: configure FOOTBALL_API_KEY em ~/KhronosScripts/.env')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Relatório salvo em $OUTPUT"
cat "$OUTPUT"
