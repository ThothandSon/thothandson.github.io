# NAME: Arte do Dia — Wikipedia + Image Playground
#!/bin/bash
# Busca os acontecimentos do dia na Wikipedia e gera uma imagem com
# Apple Image Playground via Shortcuts.
#
# Requisito: Shortcut "Khronos: Arte do Dia" instalado.
# Para instalar, rode:  bash arte_do_dia_setup.sh  (no mesmo diretório)

set -euo pipefail

SHORTCUT_NAME="Khronos: Arte do Dia"
OUTPUT_DIR="$HOME/KhronosScripts/logs/arte_do_dia"
mkdir -p "$OUTPUT_DIR"

TODAY_MM=$(date +%m)
TODAY_DD=$(date +%d)
TODAY_LABEL=$(date +%Y-%m-%d)

PROMPT_FILE="$OUTPUT_DIR/.prompt_${TODAY_LABEL}.txt"
IMAGE_FILE="$OUTPUT_DIR/arte_${TODAY_LABEL}.png"

if [ -f "$IMAGE_FILE" ]; then
    echo "Arte de hoje já existe: $IMAGE_FILE"
    open "$IMAGE_FILE"
    exit 0
fi

echo "Buscando acontecimentos de ${TODAY_DD}/${TODAY_MM} na Wikipedia..."

EVENTS_JSON=$(curl -sf "https://pt.wikipedia.org/api/rest_v1/feed/onthisday/events/${TODAY_MM}/${TODAY_DD}" 2>/dev/null || echo "")

if [ -z "$EVENTS_JSON" ]; then
    echo "Falha ao acessar a Wikipedia. Usando prompt genérico."
    PROMPT="Uma ilustração artística representando o dia ${TODAY_DD}/${TODAY_MM}, com elementos históricos e atmosfera contemplativa. Estilo: pintura a óleo renascentista com tons dourados."
else
    PROMPT=$(echo "$EVENTS_JSON" | python3 -c "
import json, sys, random

data = json.load(sys.stdin)
events = data.get('events', [])

if not events:
    print('Uma ilustração artística do dia, com elementos históricos e atmosfera contemplativa.')
    sys.exit(0)

# Pegar os 3 eventos mais marcantes (prefere mais antigos por serem mais icônicos)
selected = sorted(events, key=lambda e: e.get('year', 2000))[:8]
random.shuffle(selected)
selected = selected[:3]

parts = []
for e in selected:
    year = e.get('year', '')
    text = e.get('text', '')
    if year and text:
        # Limpar texto
        clean = text.replace('[', '').replace(']', '')
        if len(clean) > 120:
            clean = clean[:120] + '...'
        parts.append(f'{year}: {clean}')

summary = '; '.join(parts)
prompt = (
    f'Uma ilustração artística inspirada nos acontecimentos históricos de hoje: {summary}. '
    f'Estilo: pintura digital cinematográfica com iluminação dramática, tons dourados e âmbar, '
    f'atmosfera épica e contemplativa. Sem texto na imagem.'
)
print(prompt)
")
fi

echo "$PROMPT" > "$PROMPT_FILE"
echo ""
echo "Prompt gerado:"
echo "  $PROMPT"
echo ""

# Verificar se o Shortcut existe
if ! shortcuts list 2>/dev/null | grep -qF "$SHORTCUT_NAME"; then
    echo "⚠️  Shortcut '$SHORTCUT_NAME' não encontrado."
    echo ""
    echo "Para configurar, abra o app Atalhos e crie um novo atalho com:"
    echo "  1. Nome: $SHORTCUT_NAME"
    echo "  2. Ação: 'Obter arquivo' (recebe o arquivo de texto com o prompt)"
    echo "  3. Ação: 'Obter texto do input'"
    echo "  4. Ação: 'Criar Imagem com Image Playground' usando o texto como descrição"
    echo "  5. Ação: 'Salvar Arquivo' em ~/KhronosScripts/logs/arte_do_dia/"
    echo ""
    echo "Ou rode:  bash $(dirname "$0")/arte_do_dia_setup.sh"
    echo ""
    echo "Prompt salvo em: $PROMPT_FILE"
    exit 1
fi

echo "Gerando imagem com Image Playground..."
shortcuts run "$SHORTCUT_NAME" \
    --input-path "$PROMPT_FILE" \
    --output-path "$IMAGE_FILE" \
    --output-type public.png 2>&1 || {
        echo "⚠️  Falha ao gerar imagem. Verifique se o Apple Intelligence está ativo."
        echo "Prompt salvo em: $PROMPT_FILE"
        exit 1
    }

if [ -f "$IMAGE_FILE" ]; then
    echo ""
    echo "Arte do dia salva em: $IMAGE_FILE"
    open "$IMAGE_FILE"
else
    echo "Imagem não foi gerada. Verifique o Shortcut '$SHORTCUT_NAME'."
    echo "Prompt salvo em: $PROMPT_FILE"
fi
