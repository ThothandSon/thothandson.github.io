# GitHub Pages Configuration - SECURITY FIRST

## 🛡️ IMPORTANTE: Sistema de Segurança Corporativo

Este projeto usa um **sistema de proteção de código proprietário** que **NÃO É COMPATÍVEL** com GitHub Actions customizados.

### ⚠️ CONFLITO IDENTIFICADO:

- **GitHub Actions**: Faria build do código fonte (EXPOSIÇÃO)
- **Sistema Local**: Ofusca código antes do commit (SEGURANÇA)
- **Resultado**: Dupla ofuscação ou exposição do código fonte

### ✅ SOLUÇÃO IMPLEMENTADA:

#### **Deploy Method**: GitHub Pages padrão (Deploy from branch)

- ✅ Código já chega ofuscado no repositório
- ✅ GitHub Pages apenas hospeda os arquivos
- ✅ Zero processamento adicional
- ✅ Máxima segurança mantida

#### **Fluxo de Segurança**:

1. **Local**: Desenvolvimento em `js/src/main.js` (NUNCA commitado)
2. **Local**: `./scripts/dev.sh prod` → Ofusca código
3. **GitHub**: Código ofuscado em `js/main.js` (PRODUÇÃO)
4. **GitHub Pages**: Deploy direto (sem processamento)

### 🚨 WARNING RESOLVIDO SEM COMPROMETER SEGURANÇA:

O warning do GitHub Pages foi resolvido através de:

- ✅ Gemfile otimizado com `github-pages` gem
- ✅ \_config.yml com plugins compatíveis
- ✅ **SEM** uso de GitHub Actions (que exporia código)

### 🎯 RESULTADO:

- ❌ GitHub Actions removido (evita exposição)
- ✅ Warning do GitHub Pages eliminado
- ✅ Sistema de segurança 100% preservado
- ✅ Código fonte protegido localmente
