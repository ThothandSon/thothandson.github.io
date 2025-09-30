#!/bin/bash

# Sistema de Backup Local para Código Fonte
# Garante que o código fonte seja preservado localmente

set -e

BACKUP_DIR="$HOME/.thothandson-backup"
PROJECT_DIR="$(pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

echo "💾 Criando backup do código fonte..."

# Backup do código fonte
if [ -f "js/src/main.js" ]; then
    mkdir -p "$BACKUP_DIR/js_src"
    cp "js/src/main.js" "$BACKUP_DIR/js_src/main_${TIMESTAMP}.js"
    echo "✅ Backup criado: $BACKUP_DIR/js_src/main_${TIMESTAMP}.js"

    # Manter apenas os 10 backups mais recentes
    cd "$BACKUP_DIR/js_src"
    ls -t main_*.js | tail -n +11 | xargs -r rm
    echo "🧹 Limpeza de backups antigos concluída"
else
    echo "⚠️  Arquivo js/src/main.js não encontrado"
fi

echo "📁 Backups disponíveis:"
ls -la "$BACKUP_DIR/js_src/" 2>/dev/null || echo "Nenhum backup encontrado"
