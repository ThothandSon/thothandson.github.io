# Thoth & Son

![Thoth & Son Logo](assets/logo.png)

> **Software Matters** - Transformando conhecimento em soluções extraordinárias

---

## 🏢 Sobre a Thoth & Son

A **Thoth & Son** é uma empresa de tecnologia fundada com a convicção de que o software realmente importa. Desenvolvemos soluções SaaS inovadoras e cultivamos iniciativas educacionais que conectam profundidade intelectual com execução pragmática.

Nossa missão é criar tecnologia que não apenas resolve problemas, mas transforma mercados - combinando excelência técnica com visão estratégica fundamentada em conhecimento profundo.

---

## 🚀 Nossas Iniciativas

### 💼 SaaS Products

#### **Ghost Rizz** - Análise Inteligente de Metadados

Uma solução proprietária de análise avançada de metadados que oferece:

- **Análise Universal**: Suporte para imagens, PDFs, áudio, vídeo, documentos e arquivos compactados
- **Extração Avançada**: EXIF, GPS com reverse geocoding, propriedades de documento
- **Visualização Interativa**: Mapas, tabelas e gráficos em tempo real
- **API Integrada**: Fácil integração com sistemas corporativos existentes

**Acesse**: [Ghost Rizz](https://thothandson.github.io/saas/ghost-rizz)

#### **Wavetrack** - Sistema de Controle de Presença

Sistema inteligente de auditoria e controle de presença de colaboradores via handshake Wi-Fi:

- **Rastreamento Automatizado**: Detecção de presença através de handshake Wi-Fi
- **Auditoria Completa**: Registro detalhado de entradas, saídas e permanência
- **Analytics em Tempo Real**: Dashboards com métricas de presença e produtividade
- **Gestão de Colaboradores**: Controle individual e por equipes
- **Relatórios Avançados**: Exportação de dados para análise e compliance
- **Conformidade LGPD**: Sistema completo de gestão de privacidade e dados

**Acesse**: [Wavetrack](https://thothandson.github.io/saas/wavetrack)

---

### 🎓 Iovis - Ecossistema de Conhecimento e Inovação

**Iovis** nasce da convicção de que as melhores soluções vêm de mentes verdadeiramente preparadas - não apenas tecnicamente, mas **intelectualmente**.

Acreditamos que o conhecimento humanístico, filosófico, literário e reflexivo não é ornamento — é fundamento. É o que separa quem resolve problemas de quem transforma mercados. É o que diferencia execução competente de visão extraordinária.

#### **Virtus Iovis** - Clube de Conhecimento

Um espaço exclusivo para a comunidade USP que cultiva o intelecto através do debate profundo e da educação sem amarras:

- **🎓 Formação Rigorosa**: Debates profundos, leituras críticas e pensamento livre
- **💬 Debate Sem Limites**: Discussões abertas, honestas e sem restrições de linguagem
- **🚀 Comunidade Exclusiva**: Restrito às melhores mentes da USP
- **📚 Conhecimento Profundo**: Formação intelectual que vai além do técnico

**Nossa Filosofia**: Da filosofia ao mercado, da reflexão à solução - preparamos mentes para desafios extraordinários.

**Acesse**: [Iovis](https://thothandson.github.io/iovis)

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
│   ├── main.js        # Código ofuscado (GitHub + Produção)
│   ├── iovis/         # Scripts da landing page Iovis
│   └── wavetrack/     # Scripts do Wavetrack
├── saas/
│   ├── ghost-rizz/    # Landing page Ghost Rizz
│   └── wavetrack/     # Landing page Wavetrack
├── iovis/             # Landing page Iovis
├── styles/            # Folhas de estilo CSS
│   ├── main.css       # Estilos principais
│   ├── ghost-rizz.css # Estilos Ghost Rizz
│   ├── wavetrack.css  # Estilos Wavetrack
│   └── iovis.css      # Estilos Iovis
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
- **Ghost Rizz**: [Análise de Metadados](https://thothandson.github.io/saas/ghost-rizz)
- **Wavetrack**: [Analytics para E-commerce](https://thothandson.github.io/saas/wavetrack)
- **Iovis**: [Clube de Conhecimento USP](https://thothandson.github.io/iovis)
- **Email**: Através dos formulários de contato em cada iniciativa

---

## 📄 Licença

Este é um projeto **PROPRIETÁRIO** da Thoth & Son. Todos os direitos reservados.

O código fonte é mantido localmente e protegido por sistemas avançados de ofuscação. **NUNCA** faça commit do diretório `js/src/` ou desative os sistemas de proteção.

---

**Thoth & Son** © 2025 - Software Matters

_Transformando conhecimento profundo em soluções extraordinárias_
