#!/usr/bin/env node
/* ============================================================
   Thoth & Son — JS syntax validation
   ────────────────────────────────────────────────────────────
   Usa o parser nativo do Node via dynamic import. Detecta
   módulos automaticamente (procura por `import`/`export`).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', 'js');
const errors = [];

function listJS(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return listJS(full);
      if (e.name.endsWith('.js')) return [full];
      return [];
    });
}

function isModule(src) {
  // Heurística simples: import/export no topo do arquivo
  return /^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"]/m.test(src) ||
         /^\s*export\s+/m.test(src);
}

const files = listJS(ROOT);
console.log(`Validando ${files.length} arquivos JS…\n`);

for (const f of files) {
  const rel = path.relative(path.resolve(__dirname, '..'), f);
  const src = fs.readFileSync(f, 'utf8');

  if (isModule(src)) {
    // ESM: --check exige arquivo .mjs em disco
    const os = require('os');
    const { spawnSync } = require('child_process');
    const tmp = path.join(os.tmpdir(), `validate-${process.pid}-${Math.random().toString(36).slice(2)}.mjs`);
    fs.writeFileSync(tmp, src);
    const r = spawnSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
    fs.unlinkSync(tmp);
    if (r.status !== 0) {
      const msg = r.stderr.toString().split('\n').slice(0, 2).join(' ').trim();
      console.log('  ✗ ' + rel + ': ' + msg);
      errors.push(rel);
    } else {
      console.log('  ✓ ' + rel + ' (module)');
    }
  } else {
    try {
      new vm.Script(src, { filename: rel });
      console.log('  ✓ ' + rel);
    } catch (err) {
      console.log('  ✗ ' + rel + ': ' + err.message);
      errors.push(rel);
    }
  }
}

console.log('');
if (errors.length) {
  console.log(`✗ ${errors.length} arquivo(s) com erro de sintaxe.`);
  process.exit(1);
}
console.log('✓ Todos os JS são válidos.');
