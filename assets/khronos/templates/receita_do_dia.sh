#!/bin/bash
# NAME: Receita do Dia
OUTPUT="$HOME/KhronosScripts/logs/receita_$(date +%Y-%m-%d).txt"
mkdir -p "$(dirname "$OUTPUT")"
echo "=== Receita do Dia — $(date '+%d/%m/%Y') ===" > "$OUTPUT"
curl -sf "https://www.themealdb.com/api/json/v1/1/random.php" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
m = data['meals'][0]
print(f'  {m[\"strMeal\"]}')
print(f'  Categoria: {m[\"strCategory\"]}')
print(f'  Origem: {m.get(\"strArea\", \"?\")}')
print()
print('  Ingredientes:')
for i in range(1, 21):
    ing = m.get(f'strIngredient{i}', '').strip()
    med = m.get(f'strMeasure{i}', '').strip()
    if ing:
        print(f'    - {med} {ing}'.strip())
print()
print('  Preparo:')
instructions = m.get('strInstructions', '')
for line in instructions.split('. '):
    line = line.strip()
    if line:
        print(f'    {line}.')
if m.get('strYoutube'):
    print(f'')
    print(f'  Video: {m[\"strYoutube\"]}')
" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$OUTPUT"
