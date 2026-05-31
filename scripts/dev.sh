#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#   Thoth & Son — dev helper
# ─────────────────────────────────────────────────────────
set -euo pipefail

cmd="${1:-help}"

case "$cmd" in
  serve)
    echo "→ jekyll serve em http://127.0.0.1:4000"
    bundle exec jekyll serve --livereload --host 127.0.0.1 --port 4000
    ;;
  build)
    echo "→ build de produção"
    JEKYLL_ENV=production bundle exec jekyll build
    ;;
  clean)
    echo "→ limpando _site/ e .jekyll-cache/"
    rm -rf _site .jekyll-cache
    ;;
  test)
    echo "→ rodando suíte de testes"
    npm test
    ;;
  *)
    cat <<EOF
Thoth & Son — dev helper

  serve   Inicia servidor local (Jekyll, livereload)
  build   Build de produção
  clean   Remove _site/ e cache
  test    Roda testes (JS + segurança + HTML)
EOF
    ;;
esac
