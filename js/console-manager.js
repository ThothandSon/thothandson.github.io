// ==========================================
// Console Management - Dev/Prod Mode
// ==========================================
// 🛡️ Desabilita console.log em produção mas mantém console.error e console.warn

(function () {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "" ||
    window.location.protocol === "file:" ||
    window.location.port !== "";

  const isDev =
    isLocal ||
    window.location.search.includes("dev=true") ||
    localStorage.getItem("thothandson_dev_mode") === "true";

  // Em produção, desabilita console.log mas mantém console.error e console.warn
  if (!isDev) {
    console.log = function () {};
    console.debug = function () {};
    console.info = function () {};
  }

  // Expõe variável global para outros scripts verificarem
  window.IS_DEV_MODE = isDev;
})();
