#!/usr/bin/env node
/* ============================================================
   Thoth & Son — Security check
   ────────────────────────────────────────────────────────────
   - Procura padrões de credenciais/segredos vazados no código
   - Verifica que os hashes do mini-game não revelam as palavras
   - Garante que não há eval(), Function() ou similar em JS próprio
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

// Arquivos a auditar (extensão e exclusões)
const EXTS = ['.js', '.html', '.yml', '.css', '.md', '.json'];
const EXCLUDE_DIRS = ['node_modules', '_site', '.git', '.jekyll-cache', 'vendor', 'tests'];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (EXTS.includes(path.extname(entry.name))) files.push(full);
  }
  return files;
}

// Padrões de segredos clássicos
const SECRET_PATTERNS = [
  { re: /AKIA[0-9A-Z]{16}/g,                              label: 'AWS Access Key' },
  { re: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/gi, label: 'AWS Secret' },
  { re: /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g, label: 'Private key' },
  { re: /ghp_[A-Za-z0-9]{36}/g,                            label: 'GitHub PAT' },
  { re: /gho_[A-Za-z0-9]{36}/g,                            label: 'GitHub OAuth' },
  { re: /sk-[A-Za-z0-9]{20,}/g,                            label: 'OpenAI key' },
  { re: /xox[baprs]-[A-Za-z0-9-]+/g,                       label: 'Slack token' },
  { re: /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/g,       label: 'SendGrid key' },
  { re: /AIza[0-9A-Za-z_-]{35}/g,                          label: 'Google API key' },
  { re: /password\s*[:=]\s*["'][^"']{4,}["']/gi,           label: 'Hardcoded password', soft: true },
  { re: /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{8,}["']/gi, label: 'Hardcoded api_key', soft: true },
];

// Padrões perigosos em JS de código próprio
const DANGEROUS_JS = [
  { re: /\beval\s*\(/g,                       label: 'eval()' },
  { re: /new\s+Function\s*\(/g,               label: 'new Function()' },
  { re: /document\.write\s*\(/g,              label: 'document.write()' },
  { re: /innerHTML\s*=\s*[^'"`]*\+/g,         label: 'innerHTML com concat (XSS risk)', soft: true },
];

const files = walk(ROOT);
console.log(`Auditando ${files.length} arquivos…\n`);

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');

  // Secrets
  for (const { re, label, soft } of SECRET_PATTERNS) {
    re.lastIndex = 0;
    const matches = content.match(re);
    if (matches) {
      const list = soft ? warnings : errors;
      list.push(`[${label}] ${rel} — ${matches.length} ocorrência(s)`);
    }
  }

  // JS perigoso (só em .js próprios)
  if (f.endsWith('.js')) {
    for (const { re, label, soft } of DANGEROUS_JS) {
      re.lastIndex = 0;
      const matches = content.match(re);
      if (matches) {
        const list = soft ? warnings : errors;
        list.push(`[${label}] ${rel} — ${matches.length} ocorrência(s)`);
      }
    }
  }
}

// Verificação específica: hashes do mini-game não devem coexistir com plaintext
const cm = path.join(ROOT, 'js', 'console-manager.js');
if (fs.existsSync(cm)) {
  const t = fs.readFileSync(cm, 'utf8');
  const FORBIDDEN_PLAIN = [
    'MENTALISMO', 'CORRESPONDENCIA', 'VIBRACAO', 'POLARIDADE',
    'RITMO', 'CAUSALIDADE', 'GENERO',
  ];
  const leaked = FORBIDDEN_PLAIN.filter((w) => t.includes(w));
  if (leaked.length) {
    errors.push(`[Cipher] console-manager.js vaza respostas em plaintext: ${leaked.join(', ')}`);
  } else {
    console.log('✓ Respostas do mini-game não estão em plaintext.');
  }
}

console.log('');
if (warnings.length) {
  console.log('⚠  AVISOS:');
  warnings.forEach((w) => console.log('   ' + w));
  console.log('');
}
if (errors.length) {
  console.log('✗ FALHAS DE SEGURANÇA:');
  errors.forEach((e) => console.log('   ' + e));
  console.log('');
  process.exit(1);
}
console.log('✓ Auditoria de segurança passou.');
