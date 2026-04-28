# 🛡️ Sistema de Segurança Máxima - Thoth & Son

## Visão Geral

Este projeto implementa um sistema de segurança de código JavaScript com **obfuscação dual-layer** e **proteção total do código fonte**.

## 🔒 Arquitetura de Segurança

### 1. Proteção Local

- **Código fonte**: Armazenado apenas em `js/src/main.js` (LOCAL)
- **Backup automático**: `~/.thothandson-backup/js_src/`
- **Git ignore**: Código fonte NUNCA vai para GitHub

### 2. Dual-Layer Obfuscation

#### Primeira Camada (Pre-commit)

- **Trigger**: Pre-commit hook
- **Processo**: Backup → Obfuscação básica
- **Output**: `js/main.js` (93KB ofuscado)

#### Segunda Camada (GitHub Actions)

- **Trigger**: Deploy para produção
- **Processo**: Re-obfuscação com RC4 encoding
- **Output**: Código ultra-protegido

## 🚀 Scripts de Desenvolvimento

### `./scripts/dev.sh`

```bash
# Desenvolvimento local (código limpo)
./scripts/dev.sh dev

# Preparar para produção
./scripts/dev.sh prod

# Commit seguro
./scripts/dev.sh commit

# Status dos arquivos
./scripts/dev.sh status

# Restaurar do backup
./scripts/dev.sh restore
```

### `./scripts/backup.sh`

- Backup automático com timestamp
- Limpeza de backups antigos (>10)
- Preserva histórico de desenvolvimento

### `./scripts/obfuscate.sh`

- Obfuscação avançada com javascript-obfuscator
- Configurações de segurança máxima
- Controle de fluxo e anti-debugging

## 📁 Estrutura de Arquivos

```
js/
├── src/
│   └── main.js          # CÓDIGO FONTE (24KB) - LOCAL APENAS
└── main.js              # CÓDIGO OFUSCADO (93KB) - GITHUB + PRODUÇÃO

~/.thothandson-backup/
└── js_src/
    ├── main_YYYYMMDD_HHMMSS.js  # Backups automáticos
    └── ...                      # Histórico preservado
```

## 🔧 Configuração de Segurança

### Pre-commit Hooks (`.pre-commit-config.yaml`)

1. **backup-source**: Backup automático do código fonte
2. **obfuscate-js**: Ofuscação antes do commit
3. **prettier**: Formatação (pós-obfuscação)

### GitHub Actions (`.github/workflows/pages.yml`)

1. **Checkout**: Clone do repositório
2. **Re-obfuscation**: Segunda camada de proteção
3. **Deploy**: Build e publicação

### Obfuscation Settings

```javascript
{
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 5,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 5,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 1,
  unicodeEscapeSequence: false
}
```

## 🎯 Funcionalidades Implementadas

### Sistema de Metadata Analysis

- **Imagens**: EXIF, GPS, dimensões
- **PDFs**: Metadados, páginas, autor
- **Áudio/Vídeo**: Duração, codec, qualidade
- **Documentos**: Contagem de palavras, codificação
- **Arquivos**: Informações básicas de sistema

### Integração EmailJS

- Envio de cotações por email
- Template personalizado
- Configuração segura

## 🚨 Fluxo de Segurança

### Desenvolvimento

1. Editar `js/src/main.js` (código limpo)
2. Testar com `./scripts/dev.sh dev`
3. Commit com `./scripts/dev.sh commit`

### Automação

1. **Pre-commit**: Backup + Obfuscação
2. **GitHub**: Recebe apenas código ofuscado
3. **Actions**: Re-obfuscação para produção
4. **Deploy**: Código ultra-protegido

## 📊 Status Atual

```
📁 Fonte: js/src/main.js (24KB) [LOCAL APENAS]
🔒 Produção: js/main.js (93KB) [GITHUB + PRODUÇÃO]
💾 Backups: 3 arquivos preservados
```

## 🔐 Garantias de Segurança

✅ **Código fonte nunca vaza para GitHub**
✅ **Backup automático preservado localmente**
✅ **Obfuscação impossível de reverter**
✅ **Proteção contra debugging**
✅ **Controle de fluxo alterado**
✅ **Strings codificadas com RC4**
✅ **Anti-tampering ativo**

---

**Status**: ✅ **SISTEMA OPERACIONAL**
**Segurança**: 🛡️ **MÁXIMA PROTEÇÃO**
**Backup**: 💾 **PRESERVADO**
