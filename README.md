# Thoth & Son - Site Oficial

![Thoth & Son Logo](assets/logo.png)

## 📋 Sobre o Projeto

Este é o site oficial da **Thoth & Son**, uma empresa especializada em análise de metadados e soluções empresariais inovadoras. O site apresenta nossos produtos, incluindo o **Ghost Rizz**, nossa solução proprietária de análise avançada de arquivos.

### ✨ Funcionalidades Principais

- **Landing Page Profissional**: Apresentação da empresa e produtos
- **Ghost Rizz**: Sistema de análise de metadados para múltiplos tipos de arquivo
- **Análise Inteligente**: Suporte para imagens, PDFs, áudio, vídeo, documentos e arquivos compactados
- **Mapeamento GPS**: Visualização de coordenadas com reverse geocoding
- **Sistema de Cotação**: Formulário integrado com EmailJS
- **Design Responsivo**: Otimizado para desktop e mobile

### 🛡️ Sistema de Segurança Avançado

Este projeto implementa um **sistema de proteção de código de nível enterprise**:

- **Dual-Layer Obfuscation**: Duas camadas de ofuscação para máxima proteção
- **Backup Automático**: Sistema de backup local do código fonte
- **Proteção Git**: Código fonte nunca é enviado para repositórios
- **CI/CD Seguro**: Pipeline automatizado com re-ofuscação para produção

## 🚀 Execução Local

### Pré-requisitos

- **Ruby** (para Jekyll)
- **Node.js** (para testes e dependências)
- **Git** (para controle de versão)

```bash
# Instalar Jekyll
gem install jekyll bundler

# Instalar dependências Node.js
npm install
```

### 1. Configuração Inicial

```bash
# Clonar o repositório
git clone https://github.com/Thoth-and-Son/thothandson.github.io.git
cd thothandson.github.io

# Dar permissões aos scripts
chmod +x scripts/*.sh
```

### 2. Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
./scripts/dev.sh serve

# Ou usando npm
npm run dev
```

O site estará disponível em:

- **Jekyll**: http://localhost:4000/?dev=true
- **Python fallback**: http://localhost:8000/?dev=true

### 3. Comandos de Desenvolvimento

```bash
# Ver status dos arquivos
./scripts/dev.sh status

# Usar código fonte (desenvolvimento)
./scripts/dev.sh dev

# Preparar para produção (ofuscar)
./scripts/dev.sh prod

# Commit seguro
./scripts/dev.sh commit
git commit -m "sua mensagem"

# Restaurar do backup
./scripts/dev.sh restore
```

### 4. Controles via Console

No navegador, abra o console e use:

```javascript
// Forçar modo desenvolvimento
switchToDevMode(); // Depois recarregue a página

// Voltar ao modo produção
switchToProdMode(); // Depois recarregue a página
```

## 🧪 Testes

### Executar Todos os Testes

```bash
# Todos os testes
npm test

# Ou individual
npm run test:js        # Validação JavaScript
npm run test:security  # Verificações de segurança
npm run test:obfuscation # Teste completo de ofuscação
```

### Testes Manuais

```bash
# Validação de sintaxe JavaScript
node tests/js-validation.js

# Verificação de segurança
node tests/security-check.js

# Teste completo de ofuscação
node tests/obfuscation-test.js
```

### Tipos de Teste

- **🧪 Validação JavaScript**: Verifica sintaxe dos arquivos JS
- **🔒 Segurança**: Confirma ofuscação e proteção do código fonte
- **🔄 Ofuscação**: Testa processo completo de proteção de código

## 📁 Estrutura do Projeto

```
thothandson.github.io/
├── _layouts/           # Templates Jekyll
├── _includes/          # Componentes reutilizáveis
├── _posts/             # Posts do blog
├── assets/             # Imagens e recursos estáticos
├── js/
│   ├── src/           # Código fonte JavaScript (LOCAL APENAS)
│   └── main.js        # Código ofuscado (GitHub + Produção)
├── saas/
│   └── ghost-rizz/    # Landing page do produto Ghost Rizz
├── styles/            # Folhas de estilo CSS
├── scripts/           # Scripts de automação
│   ├── dev.sh         # Script principal de desenvolvimento
│   ├── obfuscate.sh   # Script de ofuscação
│   └── backup.sh      # Sistema de backup
├── tests/             # Testes automatizados
└── .github/           # Workflows GitHub Actions
```

## 🔧 Configuração de Produção

### Ofuscação e Deploy

O sistema automaticamente:

1. **Pre-commit**: Faz backup e ofusca o código
2. **GitHub Actions**: Aplica segunda camada de ofuscação
3. **Deploy**: Publica site com código ultra-protegido

### Configuração de Segurança

- **Backup Local**: `~/.thothandson-backup/js_src/`
- **Git Ignore**: `js/src/` nunca vai para GitHub
- **Pre-commit Hooks**: Automação de segurança
- **Obfuscação RC4**: Encoding avançado em produção

## 📊 Monitoramento

### Status do Sistema

```bash
# Verificar status completo
./scripts/dev.sh status

# Exemplo de saída:
# 📁 Fonte: js/src/main.js (24KB) [LOCAL APENAS]
# 🔒 Produção: js/main.js (93KB) [GITHUB + PRODUÇÃO]
# 💾 Backups: 4 arquivos preservados
```

### Logs e Debug

- **Console do navegador**: Logs de desenvolvimento/produção
- **GitHub Actions**: Logs de deploy
- **Backup logs**: Histórico de proteção de código

## 🏢 Produtos

### Ghost Rizz

Nossa solução proprietária de análise de metadados que oferece:

- **Análise Universal**: Suporte para todos os tipos de arquivo
- **Extração Avançada**: EXIF, GPS, propriedades de documento
- **Visualização Interativa**: Mapas, tabelas e gráficos
- **API Integrada**: Fácil integração com sistemas existentes

### Serviços

- Análise de metadados corporativa
- Soluções de inteligência de arquivos
- Consultoria em segurança digital
- Desenvolvimento de ferramentas customizadas

## 📞 Contato

- **Site**: [thothandson.github.io](https://thothandson.github.io)
- **Produto**: [Ghost Rizz](https://thothandson.github.io/saas/ghost-rizz)
- **Email**: Através do formulário de cotação no site

## 📄 Licença

Este é um projeto **PROPRIETÁRIO** da Thoth & Son. Todos os direitos reservados.

---

## 🚨 Aviso de Segurança

Este projeto implementa um sistema de proteção de código avançado. **NUNCA** faça commit do diretório `js/src/` ou desative os sistemas de proteção. O código fonte é mantido apenas localmente para preservar a propriedade intelectual da empresa.

### Backup e Recuperação

Em caso de perda do código fonte:

```bash
# Listar backups disponíveis
ls -la ~/.thothandson-backup/js_src/

# Restaurar backup mais recente
./scripts/dev.sh restore

# Verificar integridade
./scripts/dev.sh status
```

---

**Thoth & Son** © 2025 - Inovação em Análise de Metadados
