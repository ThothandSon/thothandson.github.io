#!/bin/bash

# Script para desenvolvimento local com segurança máxima
# Código fonte NUNCA vai para o GitHub

set -e

case "$1" in
    "dev")
        echo "🔧 Modo desenvolvimento: usando código fonte"
        if [ -f "js/src/main.js" ]; then
            # Copia código fonte para produção (temporário para testes locais)
            cp js/src/main.js js/main.js
            echo "✅ Usando js/src/main.js (código fonte limpo)"
            echo "⚠️  LEMBRE-SE: Não faça commit neste estado!"
        else
            echo "❌ Código fonte não encontrado em js/src/main.js"
        fi
        ;;
    "prod")
        echo "🔒 Modo produção: ofuscando código"
        ./scripts/backup.sh
        ./scripts/obfuscate.sh
        echo "✅ Usando js/main.js (código ofuscado)"
        echo "✅ Pronto para commit/produção"
        ;;
    "commit")
        echo "📤 Preparando para commit seguro..."
        ./scripts/backup.sh
        ./scripts/obfuscate.sh
        git add js/main.js
        echo "✅ Arquivo ofuscado adicionado ao git"
        echo "💡 Agora você pode fazer: git commit -m 'sua mensagem'"
        ;;
    "restore")
        echo "🔄 Restaurando do backup mais recente..."
        BACKUP_DIR="$HOME/.thothandson-backup/js_src"
        if [ -d "$BACKUP_DIR" ]; then
            LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/main_*.js 2>/dev/null | head -n1)
            if [ -n "$LATEST_BACKUP" ]; then
                mkdir -p js/src
                cp "$LATEST_BACKUP" js/src/main.js
                echo "✅ Código fonte restaurado de: $(basename "$LATEST_BACKUP")"
            else
                echo "❌ Nenhum backup encontrado"
            fi
        else
            echo "❌ Diretório de backup não encontrado"
        fi
        ;;
    "status")
        echo "📊 Status dos arquivos JavaScript:"
        if [ -f "js/src/main.js" ]; then
            echo "  📁 Fonte: js/src/main.js ($(wc -c < js/src/main.js) bytes) [LOCAL APENAS]"
        else
            echo "  ❌ Fonte: js/src/main.js (não encontrado)"
        fi

        if [ -f "js/main.js" ]; then
            echo "  🔒 Produção: js/main.js ($(wc -c < js/main.js) bytes) [GITHUB + PRODUÇÃO]"
            # Verificar se está ofuscado
            lines=$(wc -l < js/main.js)
            if [ "$lines" -lt 10 ]; then
                echo "    ✅ Aparenta estar ofuscado ($lines linhas)"
            else
                echo "    ⚠️  Aparenta estar limpo ($lines linhas)"
            fi
        else
            echo "  ❌ Produção: js/main.js (não encontrado)"
        fi

        # Status do backup
        BACKUP_DIR="$HOME/.thothandson-backup/js_src"
        if [ -d "$BACKUP_DIR" ]; then
            BACKUP_COUNT=$(ls "$BACKUP_DIR"/main_*.js 2>/dev/null | wc -l)
            echo "  💾 Backups: $BACKUP_COUNT arquivos em $BACKUP_DIR"
        else
            echo "  💾 Backups: nenhum backup encontrado"
        fi
        ;;
    *)
        echo "�️  Script de Desenvolvimento Seguro"
        echo ""
        echo "🔒 ATENÇÃO: Código fonte NUNCA vai para GitHub!"
        echo ""
        echo "Comandos disponíveis:"
        echo "  dev     - Usar código fonte (desenvolvimento local apenas)"
        echo "  prod    - Ofuscar código (preparar para produção)"
        echo "  commit  - Preparar e adicionar arquivo ofuscado para commit"
        echo "  restore - Restaurar código fonte do backup mais recente"
        echo "  status  - Mostrar status dos arquivos e backups"
        echo ""
        echo "Fluxo recomendado:"
        echo "  1. ./scripts/dev.sh dev      # Para desenvolver"
        echo "  2. ./scripts/dev.sh commit   # Para preparar commit"
        echo "  3. git commit -m 'mensagem'  # Para commitar"
        echo ""
        echo "🚨 IMPORTANTE: Backups em $HOME/.thothandson-backup/"
        ;;
esac
