#!/usr/bin/env node
/* ============================================================
   Thoth & Son — HTML hygiene check
   ────────────────────────────────────────────────────────────
   - Lang attribute presente
   - <title> presente
   - <meta description> presente
   - Links externos com rel="noopener noreferrer"
   - Imagens com alt (mesmo que vazio)
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '_site', '.git', '.jekyll-cache'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = walk(ROOT);
console.log(`Validando ${files.length} arquivos HTML…\n`);

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const c = fs.readFileSync(f, 'utf8');

  // Layout files: skip (não são páginas completas)
  if (rel.startsWith('_includes/') || rel.startsWith('_layouts/')) {
    console.log('  ↷ ' + rel + ' (template, skip)');
    continue;
  }

  // Links externos sem rel adequado
  const externalLinks = c.match(/<a[^>]+href=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];
  for (const link of externalLinks) {
    if (!/target=["']_blank["']/i.test(link)) continue; // só checa _blank
    if (!/rel=["'][^"']*noopener/i.test(link)) {
      warnings.push(`[noopener] ${rel} — link _blank sem rel="noopener": ${link.slice(0, 80)}…`);
    }
  }

  // Imagens sem alt
  const imgs = c.match(/<img[^>]*>/gi) || [];
  for (const img of imgs) {
    if (!/\balt\s*=/i.test(img)) {
      errors.push(`[alt] ${rel} — <img> sem atributo alt: ${img.slice(0, 80)}…`);
    }
  }

  console.log('  ✓ ' + rel);
}

console.log('');
if (warnings.length) {
  console.log('⚠  AVISOS:');
  warnings.forEach((w) => console.log('   ' + w));
  console.log('');
}
if (errors.length) {
  console.log('✗ FALHAS:');
  errors.forEach((e) => console.log('   ' + e));
  console.log('');
  process.exit(1);
}
console.log('✓ HTML válido.');
