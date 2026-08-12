# NAME: IMDB — Lançamentos da Semana
#!/bin/bash
OUTPUT="$HOME/KhronosScripts/logs/imdb_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== IMDB — Lançamentos — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -s "https://www.imdb.com/chart/moviemeter/" \
  -H "User-Agent: Mozilla/5.0" \
  | python3 -c "
import sys, re
html = sys.stdin.read()
titles = re.findall(r'<h3[^>]*class=\"ipc-title__text\"[^>]*>(\d+\.\s+[^<]+)</h3>', html)
if not titles:
    titles = re.findall(r'\"titleText\":\{\"text\":\"([^\"]+)\"', html)
for t in titles[:20]:
    t = t.strip()
    print(f'  {t}')
if not titles:
    print('  Nenhum resultado (IMDB pode ter bloqueado scraping).')
    print('  Dica: considere usar a API do TMDB (tmdb.org) com chave grátis.')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Relatório salvo em $OUTPUT"
cat "$OUTPUT"
