#!/bin/bash
# NAME: Compilar Logs do Dia
LOGS_DIR="$HOME/KhronosScripts/logs"
TODAY=$(date +%Y-%m-%d)
OUTPUT="$LOGS_DIR/relatorio_${TODAY}.txt"
mkdir -p "$LOGS_DIR"
python3 -c "
import os, glob, datetime
logs_dir = os.path.expanduser('~/KhronosScripts/logs')
today = '${TODAY}'
files = sorted(glob.glob(os.path.join(logs_dir, f'*_{today}.txt')))
files = [f for f in files if 'relatorio_' not in f]

if not files:
    print('Nenhum log de hoje encontrado.')
    exit(0)

out = os.path.join(logs_dir, f'relatorio_{today}.txt')
content = f'KHRONOS — Relatorio de {today}\n' + '=' * 50 + '\n\n'
for f in files:
    with open(f) as fh:
        content += fh.read() + '\n\n'

with open(out, 'w') as fh:
    fh.write(content)
print(f'Relatorio salvo em: {out}')
print(f'  {len(files)} log(s) compilado(s)')
" 2>&1
