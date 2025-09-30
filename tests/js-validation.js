#!/usr/bin/env node

/**
 * Teste de validação JavaScript
 * Verifica se os arquivos JavaScript são válidos
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Executando testes de validação JavaScript...\n");

// Função para validar sintaxe JavaScript
function validateJavaScript(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Tenta parsear o JavaScript (validação básica)
    new Function(content);

    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Testes
const tests = [
  {
    name: "Validação do arquivo principal (js/main.js)",
    file: "js/main.js",
    required: true,
  },
  {
    name: "Validação do código fonte (js/src/main.js)",
    file: "js/src/main.js",
    required: true,
  },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const filePath = path.join(process.cwd(), test.file);

  if (!fs.existsSync(filePath)) {
    if (test.required) {
      console.log(`❌ ${test.name}: Arquivo não encontrado`);
      failed++;
    } else {
      console.log(`⚠️  ${test.name}: Arquivo opcional não encontrado`);
    }
    continue;
  }

  const result = validateJavaScript(filePath);

  if (result.valid) {
    console.log(`✅ ${test.name}: Válido`);
    passed++;
  } else {
    console.log(`❌ ${test.name}: Erro de sintaxe - ${result.error}`);
    failed++;
  }
}

// Resultado final
console.log(`\n📊 Resultado dos testes JavaScript:`);
console.log(`✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}`);

if (failed > 0) {
  console.log("\n🚨 Alguns testes falharam!");
  process.exit(1);
} else {
  console.log("\n🎉 Todos os testes passaram!");
  process.exit(0);
}
