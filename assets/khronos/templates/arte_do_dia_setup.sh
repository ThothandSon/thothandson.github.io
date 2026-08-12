# NAME: Setup — Criar Shortcut "Arte do Dia"
#!/bin/bash
# Abre o app Atalhos com instruções para criar o shortcut necessário.

SHORTCUT_NAME="Khronos: Arte do Dia"

if shortcuts list 2>/dev/null | grep -qF "$SHORTCUT_NAME"; then
    echo "✅ Shortcut '$SHORTCUT_NAME' já existe."
    echo ""
    echo "Testando..."
    PROMPT_FILE="/tmp/khronos_arte_teste.txt"
    echo "Um gato samurai dourado meditando sob cerejeiras em flor ao pôr do sol. Estilo: ukiyo-e japonês." > "$PROMPT_FILE"
    OUTPUT_FILE="/tmp/khronos_arte_teste.png"
    shortcuts run "$SHORTCUT_NAME" \
        --input-path "$PROMPT_FILE" \
        --output-path "$OUTPUT_FILE" \
        --output-type public.png 2>&1
    if [ -f "$OUTPUT_FILE" ]; then
        echo "✅ Teste bem-sucedido! Imagem gerada em: $OUTPUT_FILE"
        open "$OUTPUT_FILE"
    else
        echo "⚠️  Shortcut executou mas não gerou imagem. Verifique as ações."
    fi
    rm -f "$PROMPT_FILE"
    exit 0
fi

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║            SETUP — Khronos: Arte do Dia                    ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  Crie o seguinte Shortcut no app Atalhos do macOS:         ║"
echo "║                                                            ║"
echo "║  Nome: Khronos: Arte do Dia                                ║"
echo "║                                                            ║"
echo "║  Ações (nesta ordem):                                      ║"
echo "║                                                            ║"
echo "║  1. 'Entrada do Atalho'                                    ║"
echo "║      → Tipo: Texto                                         ║"
echo "║                                                            ║"
echo "║  2. 'Criar Imagem com Image Playground'                    ║"
echo "║      → Descrição: 'Entrada do Atalho'                      ║"
echo "║                                                            ║"
echo "║  3. 'Parar e Retornar'                                     ║"
echo "║      → Retornar: 'Imagem criada'                           ║"
echo "║                                                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Abrindo o app Atalhos..."
open -a "Shortcuts"
echo ""
echo "Após criar o shortcut, rode este script novamente para testar."
