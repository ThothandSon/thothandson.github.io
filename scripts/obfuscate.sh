#!/bin/bash

# Script para ofuscar JavaScript files
# Usado tanto no pre-commit local quanto no GitHub Actions

set -e

echo "🔒 Iniciando ofuscação do JavaScript..."

# Verificar se javascript-obfuscator está instalado
if ! command -v javascript-obfuscator &> /dev/null; then
    echo "📦 Instalando javascript-obfuscator..."
    npm install -g javascript-obfuscator
fi

# Diretórios
SRC_DIR="js/src"
DIST_DIR="js"
SOURCE_FILE="$SRC_DIR/main.js"
TARGET_FILE="$DIST_DIR/main.js"

# Verificar se arquivo fonte existe
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Arquivo fonte não encontrado: $SOURCE_FILE"
    exit 1
fi

echo "📁 Ofuscando $SOURCE_FILE -> $TARGET_FILE"

# Ofuscar JavaScript com configurações avançadas
javascript-obfuscator "$SOURCE_FILE" \
    --output "$TARGET_FILE" \
    --compact true \
    --control-flow-flattening true \
    --control-flow-flattening-threshold 1 \
    --dead-code-injection true \
    --dead-code-injection-threshold 0.4 \
    --identifier-names-generator hexadecimal \
    --numbers-to-expressions true \
    --self-defending true \
    --string-array true \
    --string-array-encoding 'base64' \
    --string-array-threshold 1 \
    --split-strings true \
    --split-strings-chunk-length 5

echo "✅ Ofuscação concluída!"

# Verificar se arquivo foi criado
if [ -f "$TARGET_FILE" ]; then
    echo "📊 Arquivo ofuscado criado: $(wc -c < "$TARGET_FILE") bytes"
else
    echo "❌ Falha na criação do arquivo ofuscado"
    exit 1
fi
