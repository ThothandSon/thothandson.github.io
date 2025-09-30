# GitHub Pages Configuration

## ⚙️ Configuração Necessária

Para remover completamente o warning do GitHub Pages, você precisa configurar o repositório para usar GitHub Actions:

### 📋 Passos no GitHub:

1. **Acesse as configurações do repositório**:
   - Vá para `Settings` → `Pages`

2. **Configure a fonte de deploy**:
   - Em "Source", selecione: **GitHub Actions**
   - (ao invés de "Deploy from a branch")

3. **Confirme a configuração**:
   - O workflow `jekyll.yml` será executado automaticamente
   - O site será construído e deployado via Actions

### ✅ Benefícios da mudança:

- ❌ Remove o warning de dependências
- ✅ Controle total sobre versões do Jekyll
- ✅ Capacidade de usar gems não suportadas pelo GitHub Pages padrão
- ✅ Build mais rápido e confiável
- ✅ Logs detalhados de build

### 🔧 Configurações atualizadas:

- **Gemfile**: Agora usa `github-pages` gem para máxima compatibilidade
- **\_config.yml**: Plugins limitados aos suportados pelo GitHub Pages
- **Workflow**: GitHub Actions configurado para deploy automático

### 🚀 Resultado:

Após esta configuração, o warning não aparecerá mais e você terá um ambiente de build mais robusto!
