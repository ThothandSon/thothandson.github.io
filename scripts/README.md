# 🔒 Sistema de Ofuscação JavaScript

Este projeto implementa um sistema automatizado de ofuscação de JavaScript que funciona tanto localmente (pre-commit) quanto na produção (GitHub Actions).

## 📁 Estrutura de Arquivos

```
js/
├── src/
│   ├── main.js        # Código fonte limpo (para desenvolvimento)
│   └── .gitkeep       # Mantém pasta no git
└── main.js            # Código ofuscado (gerado automaticamente)

scripts/
├── obfuscate.sh       # Script de ofuscação
└── dev.sh             # Script auxiliar de desenvolvimento
```

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento Local

- **Edite apenas**: `js/src/main.js` (código fonte limpo)
- **Nunca edite**: `js/main.js` (será sobrescrito)

### 2. Pre-commit (Automático)

- Quando você faz commit de mudanças em `js/src/main.js`
- O pre-commit automaticamente ofusca o código
- O arquivo `js/main.js` é atualizado e incluído no commit

### 3. GitHub Actions (Automático)

- Durante o build na produção
- O código é re-ofuscado com configurações avançadas
- O site é publicado com código totalmente protegido

## 🛠️ Comandos Úteis

### Scripts de Desenvolvimento

```bash
# Ver status dos arquivos
./scripts/dev.sh status

# Usar código limpo para desenvolvimento local
./scripts/dev.sh dev

# Ofuscar manualmente para produção
./scripts/dev.sh prod
```

### Ofuscação Manual

```bash
# Ofuscar código fonte
./scripts/obfuscate.sh
```

### Pre-commit Manual

```bash
# Rodar pre-commit em todos os arquivos
pre-commit run --all-files

# Rodar apenas ofuscação
pre-commit run obfuscate-js
```

## ⚙️ Configuração de Ofuscação

O script `obfuscate.sh` usa as seguintes configurações:

- **Control Flow Flattening**: Dificulta análise do fluxo
- **Dead Code Injection**: Adiciona código inútil
- **String Array**: Codifica strings
- **Self Defending**: Código se protege contra debugging
- **String Rotation**: Rotaciona arrays de strings
- **RC4 Encoding**: Criptografia adicional

## 🔧 Desenvolvimento

### Para Trabalhar Localmente

1. Edite `js/src/main.js` normalmente
2. Use `./scripts/dev.sh dev` para testar sem ofuscação
3. Commit normalmente - o pre-commit ofuscará automaticamente

### Para Testar Ofuscação Local

1. Execute `./scripts/dev.sh prod`
2. Teste o site com código ofuscado
3. Use `./scripts/dev.sh dev` para voltar ao desenvolvimento

## 🚨 Regras Importantes

1. **NUNCA** edite `js/main.js` diretamente
2. **SEMPRE** trabalhe em `js/src/main.js`
3. **CONFIE** no sistema automático de ofuscação
4. **TESTE** localmente antes de fazer push

## 📊 Verificação

Para verificar se o sistema está funcionando:

```bash
# Ver status
./scripts/dev.sh status

# Deve mostrar:
# 📁 Fonte: js/src/main.js (X bytes)
# 🔒 Produção: js/main.js (Y bytes)
# ✅ Aparenta estar ofuscado (poucas linhas)
```

## 🔐 Segurança

- **Código fonte**: Permanece legível em `js/src/`
- **Código produção**: Ofuscado em `js/main.js`
- **Dupla proteção**: Pre-commit + GitHub Actions
- **Self-defending**: Código resiste a debugging
- **Múltiplas camadas**: Strings, controle de fluxo, dead code
