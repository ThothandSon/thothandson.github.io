/* ============================================================
   Thoth & Son — Console Manager + Easter Egg + Cipher Game
   ============================================================
   Os 7 Princípios Herméticos. 6 cifras clássicas diferentes.
   As respostas NÃO estão em texto plano neste código —
   apenas hashes salgados (SHA-256). Pode ler à vontade.
   ============================================================ */
(function () {
  'use strict';

  // ── Dev mode detection ──────────────────────────────────────
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '' ||
    window.location.protocol === 'file:' ||
    window.location.port !== '';

  const isDev =
    isLocal ||
    window.location.search.includes('dev=true') ||
    localStorage.getItem('thothandson_dev_mode') === 'true';

  window.IS_DEV_MODE = isDev;

  const origLog = console.log.bind(console);

  // ── Easter egg: brand mark ──────────────────────────────────
  const GOLD = '#C8A030';
  const WHITE = '#F5F5F5';
  const DIM = '#888';

  const ascii = [
    '',
    ' ████████ ██   ██  ██████  ████████ ██   ██   ██████  ██████  ███   ██',
    '    ██    ██   ██ ██    ██    ██    ██   ██  ██      ██    ██ ████  ██',
    '    ██    ███████ ██    ██    ██    ███████   █████  ██    ██ ██ ██ ██',
    '    ██    ██   ██ ██    ██    ██    ██   ██       ██ ██    ██ ██  ████',
    '    ██    ██   ██  ██████     ██    ██   ██  ██████   ██████  ██   ███',
    '',
  ].join('\n');

  origLog('%c' + ascii,
    `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:10px;line-height:1.15;`);
  origLog('%c  P R E C I S Ã O  .  C U L T U R A  .  R E S U L T A D O',
    `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;`);
  origLog('%c  —  thothandson.github.io  ·  São Paulo, Brasil',
    `color:${DIM};font-family:'IBM Plex Mono',monospace;font-size:10px;`);
  origLog(' ');
  origLog('%cVocê chegou no console. Há um segredo esperando para ser revelado.',
    `color:${WHITE};font-family:'IBM Plex Mono',monospace;font-size:11px;`);
  origLog('%cDigite: %cthoth.help()',
    `color:${DIM};font-family:'IBM Plex Mono',monospace;font-size:11px;`,
    `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:bold;`);
  origLog(' ');

  // ── Hashes salgados (SHA-256 com salt embutido) ─────────────
  // As palavras de resposta NÃO estão no código. Cada hash é
  // sha256(SALT + resposta_em_maiúsculas).
  // Brute-force teórico não revela nada se você não souber o salt
  // — e mesmo com o salt, precisa de uma wordlist de termos herméticos.
  const SALT = 'thoth-asa-rubra-1923';

  // Cada desafio: o texto cifrado (que o usuário vê) +
  // o hash da resposta plain (para verificação) +
  // método e parâmetro (para mostrar a pista).
  const challenges = [
    {
      n: 1, theme: 'O Todo é Mente. Tudo o que existe é uma criação mental.',
      method: 'Cifra de César', hint: 'shift = 3',
      encrypted: 'PHQWDOLVPR',
      hash: '8bbabc06d2342b99dba630df68d6699ce5185fa62b03c118152237dbd27a1b1c',
    },
    {
      n: 2, theme: 'Como acima, assim abaixo. Como abaixo, assim acima.',
      method: 'Cifra Atbash', hint: 'A↔Z, B↔Y, C↔X… (espelho do alfabeto)',
      encrypted: 'XLIIVHKLMWVMXRZ',
      hash: 'c53ea30cf3fe35ea09e45eccbd3cef10583f599c70a381f89fe4f9498e4cc021',
    },
    {
      n: 3, theme: 'Nada está parado. Tudo se move. Tudo vibra.',
      method: 'Cifra de Vigenère', hint: 'chave = MAAT (deusa egípcia da verdade)',
      encrypted: 'HIBKMCAH',
      hash: 'a1825cd3dada9c0a6d49f6457227b5976151fdb248b161931a999c597085acf6',
    },
    {
      n: 4, theme: 'Tudo é dual. Tudo tem polos. Tudo tem seu par de opostos.',
      method: 'Inversão (Reverse)', hint: 'leia ao contrário — a polaridade da escrita',
      encrypted: 'EDADIRALOP',
      hash: 'ba6a72ab5895e5cd1ba279e75b026bd6e9be250c57915a547d068d032179a8bd',
    },
    {
      n: 5, theme: 'Tudo flui, refluir. Tudo tem suas marés.',
      method: 'Cifra Rail Fence', hint: 'zigue-zague em 3 trilhos',
      encrypted: 'ROIMT',
      hash: '3aa4503d404e54e87abe4d30e32cce41ace58bde617f676c5e0757f91715bc51',
    },
    {
      n: 6, theme: 'Toda causa tem seu efeito. Nada escapa à Lei.',
      method: 'Cifra A1Z26', hint: 'A=1, B=2 … Z=26',
      encrypted: '3-1-21-19-1-12-9-4-1-4-5',
      hash: 'c336893209719709cce6e55fb3de07249d1feb1b516f28cb0f17f2f03e57da60',
    },
    {
      n: 7, theme: 'O gênero está em tudo. Tudo tem seu princípio masculino e feminino.',
      method: 'Cifra de César (ROT13)', hint: 'shift = 13 — dual: aplicar duas vezes retorna ao original',
      encrypted: 'TRAREB',
      hash: 'eaa37799a1a8644fddbdd324a4a0dfce35aa33515ec0e5ae1138417fd9853ae3',
    },
  ];

  // ── SHA-256 nativo (Web Crypto API) ─────────────────────────
  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ── Console styles ──────────────────────────────────────────
  const sGold  = `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:12px;`;
  const sWhite = `color:${WHITE};font-family:'IBM Plex Mono',monospace;font-size:12px;`;
  const sDim   = `color:${DIM};font-family:'IBM Plex Mono',monospace;font-size:11px;`;
  const sBold  = `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:bold;`;
  const sBig   = `color:${GOLD};font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:bold;letter-spacing:2px;`;

  // ── thoth namespace ─────────────────────────────────────────
  const thoth = {
    _level: 0,
    _solved: 0,
    _attempts: 0,

    help() {
      origLog(' ');
      origLog('%c┌─ THOTH & SON · KYBALION ───────────────────────────┐', sGold);
      origLog('%c│', sGold);
      origLog('%c│  Os 7 Princípios Herméticos.', sGold);
      origLog('%c│  Sete cifras clássicas. Sete revelações.', sGold);
      origLog('%c│', sGold);
      origLog('%c│  thoth.cipher()         %c→ revela o desafio atual', sGold, sDim);
      origLog('%c│  thoth.solve("X")       %c→ submete uma resposta', sGold, sDim);
      origLog('%c│  thoth.hint()           %c→ revela o método/chave', sGold, sDim);
      origLog('%c│  thoth.status()         %c→ mostra seu progresso', sGold, sDim);
      origLog('%c│  thoth.reset()          %c→ recomeça do nível 1', sGold, sDim);
      origLog('%c│', sGold);
      origLog('%c└────────────────────────────────────────────────────┘', sGold);
      origLog(' ');
      origLog('%c→ Comece com: %cthoth.cipher()', sWhite, sBold);
      origLog(' ');
    },

    cipher() {
      if (this._level >= challenges.length) {
        origLog('%c✓ Todos os princípios decifrados.', sBig);
        origLog('%cVocê é digno.', sWhite);
        return;
      }
      const ch = challenges[this._level];
      origLog(' ');
      origLog('%c┌─ PRINCÍPIO ' + ch.n + '/' + challenges.length +
        ' ──────────────────────────────┐', sGold);
      origLog('%c│', sGold);
      origLog('%c│  %c' + ch.theme, sGold, sWhite);
      origLog('%c│', sGold);
      origLog('%c│  Mensagem cifrada:  %c' + ch.encrypted, sGold, sBig);
      origLog('%c│', sGold);
      origLog('%c│  Método: ' + ch.method, sDim);
      origLog('%c│  Resposta: uma palavra, sem espaços, sem acentos.', sDim);
      origLog('%c│', sGold);
      origLog('%c└────────────────────────────────────────────────────┘', sGold);
      origLog('%c→ Resposta: %cthoth.solve("...")', sWhite, sBold);
      origLog(' ');
    },

    async solve(answer) {
      if (typeof answer !== 'string') {
        origLog('%c✗ Passe a resposta como string. Ex: thoth.solve("EXEMPLO")', sDim);
        return;
      }
      if (this._level >= challenges.length) {
        origLog('%cJá decifrou tudo. Use thoth.reset() para recomeçar.', sDim);
        return;
      }
      this._attempts++;
      const ch = challenges[this._level];
      const guess = answer
        .toUpperCase()
        .normalize('NFD')                  // separa acentos
        .replace(/[̀-ͯ]/g, '')   // remove acentos
        .replace(/[^A-Z]/g, '');           // mantém só letras

      const h = await sha256(SALT + guess);

      if (h === ch.hash) {
        this._solved++;
        this._level++;
        origLog(' ');
        origLog('%c✓ DECIFRADO.', sBig);
        origLog('%c  ' + guess, sWhite);
        origLog(' ');
        if (this._level < challenges.length) {
          origLog('%c→ Próximo princípio: %cthoth.cipher()', sWhite, sBold);
        } else {
          origLog('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', sGold);
          origLog('%c   Os 7 Princípios Herméticos foram revelados.', sBig);
          origLog('%c   Tentativas totais: ' + this._attempts, sDim);
          origLog('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', sGold);
          origLog(' ');
          origLog('%c"Os lábios da sabedoria estão fechados,', sWhite);
          origLog('%c excepto aos ouvidos do Entendimento."', sWhite);
          origLog('%c                                  — O Caibalion', sDim);
          origLog(' ');
          origLog('%c→ Conversa: %cthothandson@icloud.com', sWhite, sBold);
        }
        origLog(' ');
      } else {
        origLog('%c✗ Incorreto. %c' + guess + ' %cnão é a resposta.', sDim, sWhite, sDim);
        origLog('%c  Use %cthoth.hint() %cse precisar de uma pista.', sDim, sBold, sDim);
      }
    },

    hint() {
      if (this._level >= challenges.length) return;
      const ch = challenges[this._level];
      origLog('%c⌬ %c' + ch.method + '%c — ' + ch.hint, sDim, sBold, sDim);
    },

    status() {
      origLog(' ');
      origLog('%c┌─ STATUS ──────────────────┐', sGold);
      origLog('%c│  Princípio atual:  %c' +
        (Math.min(this._level + 1, challenges.length)) + '/' + challenges.length, sGold, sWhite);
      origLog('%c│  Decifrados:       %c' + this._solved, sGold, sWhite);
      origLog('%c│  Tentativas:       %c' + this._attempts, sGold, sWhite);
      origLog('%c└───────────────────────────┘', sGold);
      origLog(' ');
    },

    reset() {
      this._level = 0;
      this._solved = 0;
      this._attempts = 0;
      origLog('%c↺ Sistema reiniciado. %cthoth.cipher()', sBold, sDim);
    },
  };

  window.thoth = thoth;

  // ── Silenciar console em produção ───────────────────────────
  if (!isDev) {
    console.log   = function () {};
    console.debug = function () {};
    console.info  = function () {};
  }
})();
