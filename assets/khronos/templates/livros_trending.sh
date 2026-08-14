#!/bin/bash
# NAME: Livros em Alta
OUTPUT="$HOME/KhronosScripts/logs/livros_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Livros em Alta — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -sf "https://openlibrary.org/trending/daily.json?limit=15" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
works = data.get('works', [])
if not works:
    print('  Nenhum resultado.')
    sys.exit(0)
for i, w in enumerate(works, 1):
    title = w.get('title', '?')
    author = ', '.join(w.get('author_name', ['?']))
    year = w.get('first_publish_year', '')
    yr = f' ({year})' if year else ''
    print(f'  {i:2d}. {title}{yr}')
    print(f'      {author}')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
