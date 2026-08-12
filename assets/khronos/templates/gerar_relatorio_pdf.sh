# NAME: Compilar Logs em PDF
#!/bin/bash
LOGS_DIR="$HOME/KhronosScripts/logs"
OUTPUT="$LOGS_DIR/relatorio_$(date +%Y-%m-%d).pdf"
mkdir -p "$LOGS_DIR"
python3 -c "
import os, glob, datetime

logs_dir = os.path.expanduser('~/KhronosScripts/logs')
today = datetime.date.today().strftime('%Y-%m-%d')
files = sorted(glob.glob(os.path.join(logs_dir, f'*_{today}.txt')))

if not files:
    print('Nenhum log de hoje encontrado.')
    exit(0)

content = f'KHRONOS — Relatório de {today}\n' + '=' * 50 + '\n\n'
for f in files:
    with open(f) as fh:
        content += fh.read() + '\n\n'

# Tenta gerar PDF com módulos disponíveis
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    out = os.path.join(logs_dir, f'relatorio_{today}.pdf')
    c = canvas.Canvas(out, pagesize=A4)
    width, height = A4
    y = height - 50
    c.setFont('Helvetica-Bold', 16)
    c.drawString(50, y, f'Khronos — Relatório de {today}')
    y -= 30
    c.setFont('Helvetica', 10)
    for line in content.split('\n'):
        if y < 50:
            c.showPage()
            y = height - 50
            c.setFont('Helvetica', 10)
        c.drawString(50, y, line[:100])
        y -= 14
    c.save()
    print(f'PDF salvo em: {out}')
except ImportError:
    # Sem reportlab, salva como TXT
    out = os.path.join(logs_dir, f'relatorio_{today}.txt')
    with open(out, 'w') as fh:
        fh.write(content)
    print(f'reportlab não instalado — relatório salvo como TXT: {out}')
    print('Para PDF: pip3 install reportlab')
" 2>&1
