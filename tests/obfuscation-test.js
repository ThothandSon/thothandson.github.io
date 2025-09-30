#!/usr/bin/env node

/**
 * Teste específico de ofuscação
 * Testa o processo completo de ofuscação
 */

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

console.log("🔄 Executando teste completo de ofuscação...\n");

async function testObfuscationProcess() {
  try {
    // 1. Verificar se arquivo fonte existe
    const srcPath = path.join(process.cwd(), "js/src/main.js");
    if (!fs.existsSync(srcPath)) {
      throw new Error("Arquivo fonte js/src/main.js não encontrado");
    }

    const originalSize = fs.statSync(srcPath).size;
    console.log(`📁 Arquivo fonte: ${originalSize} bytes`);

    // 2. Executar ofuscação
    console.log("🔒 Executando ofuscação...");
    await execAsync("./scripts/dev.sh prod");

    // 3. Verificar arquivo ofuscado
    const prodPath = path.join(process.cwd(), "js/main.js");
    if (!fs.existsSync(prodPath)) {
      throw new Error("Arquivo ofuscado js/main.js não foi criado");
    }

    const obfuscatedSize = fs.statSync(prodPath).size;
    console.log(`🔒 Arquivo ofuscado: ${obfuscatedSize} bytes`);

    // 4. Verificar se tamanho aumentou (indicativo de ofuscação)
    if (obfuscatedSize <= originalSize) {
      throw new Error("Arquivo ofuscado não é maior que o original");
    }

    // 5. Verificar se conteúdo foi alterado
    const srcContent = fs.readFileSync(srcPath, "utf8");
    const prodContent = fs.readFileSync(prodPath, "utf8");

    if (srcContent === prodContent) {
      throw new Error("Conteúdo do arquivo não foi ofuscado");
    }

    // 6. Verificar se strings específicas foram ofuscadas
    const testStrings = ["console.log", "function", "const"];
    let obfuscatedStrings = 0;

    for (const str of testStrings) {
      const srcCount = (srcContent.match(new RegExp(str, "g")) || []).length;
      const prodCount = (prodContent.match(new RegExp(str, "g")) || []).length;

      if (prodCount < srcCount) {
        obfuscatedStrings++;
      }
    }

    console.log(
      `🔄 Strings ofuscadas: ${obfuscatedStrings}/${testStrings.length}`,
    );

    // 7. Verificar backup foi criado
    const backupDir = path.join(process.env.HOME, ".thothandson-backup/js_src");
    if (!fs.existsSync(backupDir)) {
      throw new Error("Diretório de backup não foi criado");
    }

    const backupFiles = fs
      .readdirSync(backupDir)
      .filter((f) => f.endsWith(".js"));
    console.log(`💾 Backups disponíveis: ${backupFiles.length}`);

    return {
      success: true,
      originalSize,
      obfuscatedSize,
      compressionRatio: (obfuscatedSize / originalSize).toFixed(2),
      obfuscatedStrings,
      backupCount: backupFiles.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Executar teste
testObfuscationProcess()
  .then((result) => {
    if (result.success) {
      console.log("\n✅ Teste de ofuscação PASSOU!");
      console.log(`📊 Estatísticas:`);
      console.log(`   Original: ${result.originalSize} bytes`);
      console.log(`   Ofuscado: ${result.obfuscatedSize} bytes`);
      console.log(`   Expansão: ${result.compressionRatio}x`);
      console.log(`   Strings ofuscadas: ${result.obfuscatedStrings}`);
      console.log(`   Backups: ${result.backupCount}`);
      process.exit(0);
    } else {
      console.log(`\n❌ Teste de ofuscação FALHOU: ${result.error}`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log(`\n💥 Erro fatal: ${error.message}`);
    process.exit(1);
  });
