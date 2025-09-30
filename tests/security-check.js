#!/usr/bin/env node

/**
 * Teste de verificação de segurança
 * Verifica se o sistema de ofuscação está funcionando
 */

const fs = require("fs");
const path = require("path");

console.log("🔒 Executando testes de segurança...\n");

// Strings que NÃO devem aparecer no código ofuscado (críticas)
const criticalStrings = [
  "Security System v1.0 Active",
  "switchToDevMode",
  "switchToProdMode",
];

// Strings que podem aparecer mas indicam menor ofuscação
const warningStrings = [
  "console.log",
  "function analyzeFileMetadata",
  "function formatMetadataValue",
];

// Função para verificar ofuscação
function checkObfuscation(filePath) {
  if (!fs.existsSync(filePath)) {
    return { passed: false, reason: "Arquivo não encontrado" };
  }

  const content = fs.readFileSync(filePath, "utf8");
  const foundCritical = [];
  const foundWarnings = [];

  // Verificar strings críticas
  for (const str of criticalStrings) {
    if (content.includes(str)) {
      foundCritical.push(str);
    }
  }

  // Verificar strings de aviso
  for (const str of warningStrings) {
    if (content.includes(str)) {
      foundWarnings.push(str);
    }
  }

  if (foundCritical.length > 0) {
    return {
      passed: false,
      reason: `Strings críticas encontradas: ${foundCritical.join(", ")}`,
    };
  }

  // Verificar se o arquivo parece ofuscado (poucas quebras de linha)
  const lines = content.split("\n").length;
  if (lines > 100) {
    return {
      passed: false,
      reason: `Muitas linhas (${lines}) - pode não estar ofuscado`,
    };
  }

  let message = "Código devidamente ofuscado";
  if (foundWarnings.length > 0) {
    message += ` (avisos: ${foundWarnings.length} strings ainda visíveis)`;
  }

  return { passed: true, reason: message };
}

// Função para verificar se código fonte existe e está protegido
function checkSourceProtection() {
  const srcPath = path.join(process.cwd(), "js/src/main.js");
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  if (!fs.existsSync(srcPath)) {
    return {
      passed: false,
      reason: "Código fonte não encontrado em js/src/main.js",
    };
  }

  if (!fs.existsSync(gitignorePath)) {
    return { passed: false, reason: "Arquivo .gitignore não encontrado" };
  }

  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  if (!gitignoreContent.includes("js/src/")) {
    return { passed: false, reason: "js/src/ não está no .gitignore" };
  }

  return { passed: true, reason: "Código fonte protegido corretamente" };
}

// Função para verificar backups
function checkBackupSystem() {
  const backupDir = path.join(process.env.HOME, ".thothandson-backup/js_src");

  if (!fs.existsSync(backupDir)) {
    return { passed: false, reason: "Diretório de backup não encontrado" };
  }

  const backupFiles = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith("main_") && f.endsWith(".js"));

  if (backupFiles.length === 0) {
    return { passed: false, reason: "Nenhum backup encontrado" };
  }

  return {
    passed: true,
    reason: `${backupFiles.length} backup(s) encontrado(s)`,
  };
}

// Executar testes
const tests = [
  {
    name: "Verificação de ofuscação (js/main.js)",
    test: () => checkObfuscation(path.join(process.cwd(), "js/main.js")),
  },
  {
    name: "Proteção do código fonte",
    test: checkSourceProtection,
  },
  {
    name: "Sistema de backup",
    test: checkBackupSystem,
  },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const result = test.test();

  if (result.passed) {
    console.log(`✅ ${test.name}: ${result.reason}`);
    passed++;
  } else {
    console.log(`❌ ${test.name}: ${result.reason}`);
    failed++;
  }
}

// Resultado final
console.log(`\n📊 Resultado dos testes de segurança:`);
console.log(`✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}`);

if (failed > 0) {
  console.log("\n🚨 Falhas de segurança detectadas!");
  process.exit(1);
} else {
  console.log("\n🛡️ Todos os testes de segurança passaram!");
  process.exit(0);
}
