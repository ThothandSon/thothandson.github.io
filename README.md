# Thoth & Son

![Thoth & Son Logo](assets/logo.png)

> **Software Matters** - Transformando conhecimento em soluções extraordinárias

---

## 🏢 Sobre a Thoth & Son

A **Thoth & Son** é uma empresa de tecnologia fundada com a convicção de que o software realmente importa. Desenvolvemos soluções SaaS inovadoras e cultivamos iniciativas educacionais que conectam profundidade intelectual com execução pragmática.

Nossa missão é criar tecnologia que não apenas resolve problemas, mas transforma mercados - combinando excelência técnica com visão estratégica fundamentada em conhecimento profundo.

---

## 🚀 Nossas Iniciativas

---

## 🎯 Nossa Visão

Construímos tecnologia com propósito e cultivamos comunidades de conhecimento porque acreditamos que:

1. **Profundidade gera inovação** - Conhecimento amplo e reflexivo produz soluções mais criativas
2. **Execução importa** - Ideias brilhantes precisam de implementação impecável
3. **Comunidade amplifica** - Mentes preparadas em diálogo constante aceleram transformação
4. **Software matters** - Tecnologia bem feita muda o jogo

---

## 📁 Estrutura do Projeto

```
thothandson.github.io/
├── _layouts/           # Templates Jekyll
├── _includes/          # Componentes reutilizáveis
│   ├── header.html     # Navegação principal
│   └── footer.html     # Rodapé do site
├── _posts/             # Posts do blog
├── assets/             # Imagens e recursos estáticos
├── js/
│   ├── src/           # Código fonte JavaScript (LOCAL APENAS)
│   └── main.js        # Código ofuscado (GitHub + Produção)
├── saas/              # Landing pages
├── styles/            # Folhas de estilo CSS
│   ├── main.css       # Estilos principais
├── scripts/           # Scripts de automação
│   ├── dev.sh         # Script principal de desenvolvimento
│   ├── obfuscate.sh   # Script de ofuscação
│   └── backup.sh      # Sistema de backup
└── tests/             # Testes automatizados
```

---

## 🛠️ Desenvolvimento

### Pré-requisitos

- **Ruby** (para Jekyll)
- **Node.js** (para testes e dependências)
- **Git** (para controle de versão)

### Configuração Inicial

```bash
# Clonar o repositório
git clone https://github.com/Thoth-and-Son/thothandson.github.io.git
cd thothandson.github.io

# Instalar Jekyll
gem install jekyll bundler

# Instalar dependências
npm install

# Dar permissões aos scripts
chmod +x scripts/*.sh
```

### Execução Local

```bash
# Iniciar servidor de desenvolvimento
./scripts/dev.sh serve

# Ou usando npm
npm run dev

# O site estará disponível em http://localhost:4000
```

### Sistema de Segurança

Este projeto implementa um **sistema de proteção de código enterprise**:

- **Dual-Layer Obfuscation**: Duas camadas de ofuscação
- **Backup Automático**: Sistema local de backup do código fonte
- **Proteção Git**: Código fonte nunca enviado para repositórios públicos
- **CI/CD Seguro**: Pipeline automatizado com re-ofuscação

```bash
# Ver status dos arquivos
./scripts/dev.sh status

# Usar código fonte (desenvolvimento)
./scripts/dev.sh dev

# Preparar para produção (ofuscar)
./scripts/dev.sh prod

# Restaurar do backup
./scripts/dev.sh restore
```

---

## 📞 Contato

- **Site Oficial**: [thothandson.github.io](https://thothandson.github.io)
- **Email**: Através dos formulários de contato em cada iniciativa

---

## 📄 Licença

Este é um projeto **PROPRIETÁRIO** da Thoth & Son. Todos os direitos reservados.

O código fonte é mantido localmente e protegido por sistemas avançados de ofuscação. **NUNCA** faça commit do diretório `js/src/` ou desative os sistemas de proteção.

---

**Thoth & Son** © 2025 - Software Matters

_Transformando conhecimento profundo em soluções extraordinárias_
