# Thoth & Son

> Precisão. Cultura. Resultado.

Site oficial — [thothandson.github.io](https://thothandson.github.io)

---

## Stack

- **Jekyll 3.x** (compatível com GitHub Pages)
- **Vanilla JS** com ES modules
- **Three.js** para a cena 3D do hero
- Tipografia: Cormorant SC, Jura, IBM Plex Mono (Google Fonts)
- Sem build step de assets

---

## Estrutura

```
.
├── _config.yml            # Configuração Jekyll
├── _includes/             # Header e footer
├── _layouts/              # default.html e post.html
├── _posts/                # Posts em Markdown
├── assets/                # Logos, ícones, modelos 3D
├── index.html             # Home
├── posts.html             # Listagem
├── status-page/           # Telemetria de serviços
├── styles/                # main.css, home.css, inner.css, status-page.css
├── js/
│   ├── console-manager.js # Easter egg + mini-game de cifras herméticas
│   ├── instruments.js     # HUD + crosshair (globais)
│   ├── home.js            # Interações da home
│   ├── hero-3d.js         # Cena 3D da home (icosaedros + cérebro)
│   ├── mini-3d.js         # Cena 3D leve das páginas internas
│   └── status.js          # Health checks da status page
├── scripts/
│   └── dev.sh             # Helper de desenvolvimento
└── tests/                 # Suíte de validação
```

---

## Desenvolvimento

Pré-requisitos: Ruby 3.x, Bundler, Node 20+.

```bash
bundle install
./scripts/dev.sh serve     # → http://127.0.0.1:4000
```

Outros comandos:

```bash
./scripts/dev.sh build     # build de produção
./scripts/dev.sh clean     # remove _site/ e cache
./scripts/dev.sh test      # suíte completa
```

---

## Testes

```bash
npm test                   # roda toda a suíte
npm run test:js            # validação de sintaxe JS/ESM
npm run test:security      # auditoria de segredos + padrões perigosos
npm run test:html          # higiene de HTML (alt, noopener, etc)
```

---

## CI

Dois workflows em `.github/workflows/`:

- **`validate.yml`** — em todo push/PR: testes + Jekyll build
- **`pages.yml`** — em push na `main`: deploy para GitHub Pages

---

## Easter egg

Abra o console do navegador. Há um sistema de cifras dos sete Princípios
Herméticos. Comece com `thoth.help()`.

As respostas estão armazenadas como hashes SHA-256 salgados — o código-fonte
não revela as palavras.

---

## Licença

Código UNLICENSED. Marca e identidade visual são propriedade de Thoth & Son.
