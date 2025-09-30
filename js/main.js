// 🔧 DESENVOLVIMENTO: Este é o código fonte limpo (js/src/main.js)
// Em produção, o sistema carregará automaticamente o código ofuscado

// Verificar se os elementos existem antes de usar
const imageUploadInput = document.getElementById("image-upload");
const processButton = document.getElementById("process-button");
const uploadStatus = document.getElementById("upload-status");
const metadataContainer = document.getElementById("metadata-container");
const metadataTableBody = document.getElementById("metadata-table-body");

// Variáveis para controlar o carregamento das bibliotecas
let exifLoaded = false;
let piexifLoaded = false;

// Carregar EXIF.js
function loadExifJS() {
  return new Promise((resolve, reject) => {
    if (window.EXIF) {
      exifLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js";
    script.onload = () => {
      if (window.EXIF) {
        exifLoaded = true;
        resolve();
      } else {
        reject(new Error("EXIF.js não disponível"));
      }
    };
    script.onerror = () => reject(new Error("Erro ao carregar EXIF.js"));
    document.head.appendChild(script);
  });
}

// Carregar piexifjs
function loadPiexifJS() {
  return new Promise((resolve, reject) => {
    if (window.piexif) {
      piexifLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.js";
    script.onload = () => {
      if (window.piexif) {
        piexifLoaded = true;
        resolve();
      } else {
        reject(new Error("piexifjs não disponível"));
      }
    };
    script.onerror = () => reject(new Error("Erro ao carregar piexifjs"));
    document.head.appendChild(script);
  });
}

// Carregar as bibliotecas quando a página carregar
Promise.all([loadExifJS(), loadPiexifJS()]).catch(console.error);

// Event listener para upload de arquivo
if (imageUploadInput) {
  imageUploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = getFileType(file);
    const fileTypeNames = {
      image: "imagem",
      pdf: "PDF",
      audio: "áudio",
      video: "vídeo",
      document: "documento",
      text: "texto",
      archive: "arquivo compactado",
      generic: "arquivo",
    };

    const typeName = fileTypeNames[fileType] || "arquivo";

    if (uploadStatus) {
      uploadStatus.style.display = "block";
      uploadStatus.textContent = `${file.name} (${typeName}) carregado. Clique em "Processar Metadados" para continuar.`;
    }

    if (processButton) {
      processButton.disabled = false;
    }
  });
}

// Configuração do EmailJS (você precisa configurar sua conta)
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_3hkbws3", // Substitua pelo seu Service ID
  TEMPLATE_ID: "template_x1rosmi", // Substitua pelo seu Template ID
  USER_ID: "5HJPpj5UhfL1AVSzY", // Substitua pela sua Public Key
};

// Inicializar EmailJS
if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Event listener para o formulário de orçamento
const quoteForm = document.getElementById("quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Coletar dados do formulário
    const formData = new FormData(quoteForm);
    const data = {
      company_name: formData.get("company-name"),
      contact_email: formData.get("contact-email"),
      file_volume: formData.get("file-volume"),
      file_types: formData.get("file-types"),
      additional_info: formData.get("additional-info"),
      date: new Date().toLocaleString("pt-BR"),
    };

    const button = quoteForm.querySelector(".quote-button");
    const originalText = button.textContent;

    button.textContent = "📤 Enviando...";
    button.disabled = true;

    email_params = {
      message: `Nova solicitação de orçamento:
          📋 DADOS DO ORÇAMENTO:

          🏢 Empresa: ${data.company_name}
          📧 E-mail: ${data.contact_email}
          📊 Volume: ${data.file_volume}
          📁 Tipos: ${data.file_types}
          📝 Info adicional: ${data.additional_info}


          📅 Data: ${data.date}
          `,
      name: data.company_name,
      email: data.contact_email,
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        email_params,
        EMAILJS_CONFIG.USER_ID,
      );

      alert(
        `✅ Obrigado ${data.company_name}! Seu pedido de orçamento foi enviado com sucesso. Entraremos em contato através do e-mail ${data.contact_email} em até 24 horas.`,
      );

      // Reset do formulário
      quoteForm.reset();
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      alert(
        "❌ Erro ao enviar. Tente novamente ou entre em contato diretamente: contato@thothandson.com",
      );
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

// Função para converter coordenadas GPS de formato DMS para decimal
function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

// Função para extrair coordenadas GPS dos metadados
function extractGPSCoordinates(exifData, piexifData) {
  let latitude = null;
  let longitude = null;

  // Tentar extrair do EXIF primeiro
  if (exifData.GPSLatitude && exifData.GPSLongitude) {
    const latDMS = exifData.GPSLatitude;
    const lonDMS = exifData.GPSLongitude;
    const latRef = exifData.GPSLatitudeRef;
    const lonRef = exifData.GPSLongitudeRef;

    if (Array.isArray(latDMS) && Array.isArray(lonDMS)) {
      latitude = convertDMSToDD(latDMS[0], latDMS[1], latDMS[2], latRef);
      longitude = convertDMSToDD(lonDMS[0], lonDMS[1], lonDMS[2], lonRef);
    }
  }

  // Tentar extrair do piexif se não encontrou no EXIF
  if (!latitude && !longitude && piexifData.GPS) {
    const gpsData = piexifData.GPS;

    if (gpsData[2] && gpsData[4]) {
      // GPSLatitude e GPSLongitude
      const latDMS = gpsData[2];
      const lonDMS = gpsData[4];
      const latRef = gpsData[1] ? String.fromCharCode(gpsData[1]) : "N";
      const lonRef = gpsData[3] ? String.fromCharCode(gpsData[3]) : "E";

      if (Array.isArray(latDMS) && Array.isArray(lonDMS)) {
        latitude = convertDMSToDD(
          latDMS[0][0] / latDMS[0][1],
          latDMS[1][0] / latDMS[1][1],
          latDMS[2][0] / latDMS[2][1],
          latRef,
        );
        longitude = convertDMSToDD(
          lonDMS[0][0] / lonDMS[0][1],
          lonDMS[1][0] / lonDMS[1][1],
          lonDMS[2][0] / lonDMS[2][1],
          lonRef,
        );
      }
    }
  }

  return { latitude, longitude };
}

// Função para obter informações de localização usando geocodificação reversa
async function getLocationInfo(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt-BR,pt,en`,
    );
    const data = await response.json();

    if (data && data.address) {
      const address = data.address;
      return {
        country: address.country || "",
        state: address.state || address.region || "",
        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          "",
        neighborhood:
          address.neighbourhood || address.suburb || address.quarter || "",
        road: address.road || "",
        displayName: data.display_name || "",
      };
    }
  } catch (error) {
    console.warn("Erro ao obter informações de localização:", error);
  }
  return null;
}

// Função para criar e exibir o mapa
async function displayGPSMap(latitude, longitude) {
  // Criar container do mapa se não existir
  let mapContainer = document.getElementById("gps-map-container");
  if (!mapContainer) {
    mapContainer = document.createElement("div");
    mapContainer.id = "gps-map-container";
    mapContainer.className = "gps-map-container";

    // Obter informações de localização
    const locationInfo = await getLocationInfo(latitude, longitude);

    let locationDetails = "";
    if (locationInfo) {
      const parts = [];
      if (locationInfo.neighborhood)
        parts.push(`🏘️ ${locationInfo.neighborhood}`);
      if (locationInfo.city) parts.push(`🏙️ ${locationInfo.city}`);
      if (locationInfo.state) parts.push(`🗺️ ${locationInfo.state}`);
      if (locationInfo.country) parts.push(`🌍 ${locationInfo.country}`);

      if (parts.length > 0) {
        locationDetails = `
          <div class="location-details">
            <p><strong>📍 Localização:</strong></p>
            <ul>
              ${parts.map((part) => `<li>${part}</li>`).join("")}
            </ul>
          </div>
        `;
      }
    }

    mapContainer.innerHTML = `
      <h3 class="gps-map-title">📍 Localização da Foto</h3>
      <p class="gps-coordinates">Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
      ${locationDetails}
      <div id="gps-map"></div>
    `;

    // Inserir após a tabela de metadados
    const metadataContainer = document.getElementById("metadata-container");
    if (metadataContainer) {
      metadataContainer.parentNode.insertBefore(
        mapContainer,
        metadataContainer.nextSibling,
      );
    }
  }

  // Criar o mapa
  setTimeout(() => {
    const map = L.map("gps-map").setView([latitude, longitude], 15);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Adicionar marcador na localização
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker
      .bindPopup(
        `<b>📸 Foto tirada aqui</b><br>Lat: ${latitude.toFixed(6)}<br>Lon: ${longitude.toFixed(6)}`,
      )
      .openPopup();
  }, 100);
}
// Função para detectar tipo de arquivo
function getFileType(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("zip") || ["zip", "rar", "7z"].includes(extension))
    return "archive";
  if (
    mimeType.includes("document") ||
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)
  )
    return "document";
  if (["txt", "json", "xml", "csv"].includes(extension)) return "text";

  return "generic";
}

// Função para extrair metadados básicos do arquivo
function getBasicFileMetadata(file) {
  return {
    "Nome do arquivo": file.name,
    Tamanho: formatFileSize(file.size),
    "Tipo MIME": file.type,
    "Última modificação": new Date(file.lastModified).toLocaleString("pt-BR"),
    Extensão: file.name.split(".").pop().toLowerCase(),
  };
}

// Função para formatar tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Função para analisar metadados de PDF
async function analyzePDFMetadata(file) {
  try {
    if (typeof pdfjsLib === "undefined") {
      throw new Error("PDF.js não carregado");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const metadata = {
      "Número de páginas": pdf.numPages,
      "Versão PDF": pdf.pdfInfo.PDFFormatVersion,
      Título: pdf.pdfInfo.Title || "Não especificado",
      Autor: pdf.pdfInfo.Author || "Não especificado",
      Assunto: pdf.pdfInfo.Subject || "Não especificado",
      Criador: pdf.pdfInfo.Creator || "Não especificado",
      Produtor: pdf.pdfInfo.Producer || "Não especificado",
      "Data de criação": pdf.pdfInfo.CreationDate
        ? new Date(pdf.pdfInfo.CreationDate).toLocaleString("pt-BR")
        : "Não especificado",
      "Data de modificação": pdf.pdfInfo.ModDate
        ? new Date(pdf.pdfInfo.ModDate).toLocaleString("pt-BR")
        : "Não especificado",
    };

    return metadata;
  } catch (error) {
    console.warn("Erro ao analisar PDF:", error);
    return { Erro: "Não foi possível analisar o PDF" };
  }
}

// Função para analisar metadados de áudio/vídeo
async function analyzeMediaMetadata(file) {
  try {
    const url = URL.createObjectURL(file);
    const element = file.type.startsWith("audio/")
      ? new Audio(url)
      : document.createElement("video");
    element.src = url;

    return new Promise((resolve) => {
      element.addEventListener("loadedmetadata", () => {
        const metadata = {
          Duração: formatDuration(element.duration),
          Largura: element.videoWidth || "N/A",
          Altura: element.videoHeight || "N/A",
        };

        URL.revokeObjectURL(url);
        resolve(metadata);
      });

      element.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        resolve({ Erro: "Não foi possível analisar o arquivo de mídia" });
      });
    });
  } catch (error) {
    console.warn("Erro ao analisar mídia:", error);
    return { Erro: "Não foi possível analisar o arquivo de mídia" };
  }
}

// Função para formatar duração
function formatDuration(seconds) {
  if (isNaN(seconds)) return "Desconhecido";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Função para analisar arquivo de texto
async function analyzeTextMetadata(file) {
  try {
    const text = await file.text();
    const lines = text.split("\n");
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    return {
      Linhas: lines.length,
      Palavras: words.length,
      Caracteres: text.length,
      "Caracteres (sem espaços)": text.replace(/\s/g, "").length,
      "Codificação estimada": "UTF-8",
    };
  } catch (error) {
    console.warn("Erro ao analisar texto:", error);
    return { Erro: "Não foi possível analisar o arquivo de texto" };
  }
}

// Função principal para analisar qualquer tipo de arquivo
async function analyzeFileMetadata(file) {
  const fileType = getFileType(file);
  const basicMetadata = getBasicFileMetadata(file);
  let specificMetadata = {};

  // Analisar metadados específicos baseado no tipo
  switch (fileType) {
    case "image":
      // Manter análise EXIF existente para imagens
      return { basic: basicMetadata, specific: {}, exif: {}, piexif: {} };

    case "pdf":
      specificMetadata = await analyzePDFMetadata(file);
      break;

    case "audio":
    case "video":
      specificMetadata = await analyzeMediaMetadata(file);
      break;

    case "text":
      specificMetadata = await analyzeTextMetadata(file);
      break;

    default:
      specificMetadata = { Tipo: "Arquivo genérico - análise limitada" };
  }

  return { basic: basicMetadata, specific: specificMetadata, fileType };
}
function formatMetadataValue(key, value) {
  // Tratar thumbnail e outros dados binários
  if (key.toLowerCase().includes("thumbnail")) {
    if (value && typeof value === "object") {
      if (value instanceof Uint8Array || Array.isArray(value)) {
        return `[Thumbnail - ${value.length} bytes]`;
      } else if (value.constructor === Object) {
        return "[Thumbnail - Dados binários]";
      }
    }
    return "[Thumbnail]";
  }

  // Tratar outros objetos especiais
  if (typeof value === "object" && value !== null) {
    if (value instanceof Uint8Array) {
      return `[Dados binários - ${value.length} bytes]`;
    } else if (Array.isArray(value)) {
      // Se é um array com poucos elementos, mostrar normalmente
      if (value.length <= 5) {
        return value.join(", ");
      } else {
        return `[Array com ${value.length} elementos]`;
      }
    } else {
      // Para outros objetos, tentar JSON.stringify com fallback
      try {
        const jsonStr = JSON.stringify(value);
        if (jsonStr.length > 100) {
          return `[Objeto - ${Object.keys(value).length} propriedades]`;
        }
        return jsonStr;
      } catch (e) {
        return `[Objeto - ${Object.keys(value).length} propriedades]`;
      }
    }
  }

  return String(value);
}

// Função para exibir metadados (atualizada para suportar todos os tipos)
function displayMetadata(exifData, piexifData, fileMetadata = null) {
  if (!metadataTableBody) return;

  metadataTableBody.innerHTML = "";

  // Se temos metadados de arquivo não-imagem, exibir eles
  if (fileMetadata) {
    // Metadados básicos
    if (fileMetadata.basic) {
      const basicHeader = document.createElement("tr");
      basicHeader.innerHTML =
        '<td colspan="2" style="background: #333; color: white; font-weight: bold;">Informações Básicas do Arquivo</td>';
      metadataTableBody.appendChild(basicHeader);

      for (const [key, value] of Object.entries(fileMetadata.basic)) {
        const row = document.createElement("tr");
        const valueCell = document.createElement("td");
        valueCell.textContent = value;
        row.innerHTML = `<td>${key}</td>`;
        row.appendChild(valueCell);
        metadataTableBody.appendChild(row);
      }
    }

    // Metadados específicos do tipo de arquivo
    if (
      fileMetadata.specific &&
      Object.keys(fileMetadata.specific).length > 0
    ) {
      const specificHeader = document.createElement("tr");
      specificHeader.innerHTML =
        '<td colspan="2" style="background: #666; color: white; font-weight: bold;">Metadados Específicos</td>';
      metadataTableBody.appendChild(specificHeader);

      for (const [key, value] of Object.entries(fileMetadata.specific)) {
        const row = document.createElement("tr");
        const valueCell = document.createElement("td");
        valueCell.textContent = value;
        row.innerHTML = `<td>${key}</td>`;
        row.appendChild(valueCell);
        metadataTableBody.appendChild(row);
      }
    }
  }

  // Verificar se há coordenadas GPS (apenas para imagens)
  const gpsCoords = extractGPSCoordinates(exifData, piexifData);

  // Mostrar dados EXIF (apenas para imagens)
  if (exifData && Object.keys(exifData).length > 0) {
    const exifHeader = document.createElement("tr");
    exifHeader.innerHTML =
      '<td colspan="2" style="background: #2c5aa0; color: white; font-weight: bold;">Metadados EXIF</td>';
    metadataTableBody.appendChild(exifHeader);

    for (const [key, value] of Object.entries(exifData)) {
      const row = document.createElement("tr");

      // Destacar dados GPS
      if (key.includes("GPS")) {
        row.style.backgroundColor = "#fff3cd";
      }

      // Formatar o valor usando a nova função
      let displayValue = formatMetadataValue(key, value);

      // Truncar valores muito longos
      if (displayValue.length > 100) {
        displayValue = displayValue.substring(0, 100) + "...";
      }

      const valueCell = document.createElement("td");
      valueCell.textContent = displayValue;
      if (String(value).length > 50 || typeof value === "object") {
        valueCell.className = "long-value";
        valueCell.title = formatMetadataValue(key, value);
      }

      row.innerHTML = `<td>${key}</td>`;
      row.appendChild(valueCell);
      metadataTableBody.appendChild(row);
    }
  }

  // Mostrar dados piexif estruturados (apenas para imagens)
  if (piexifData && Object.keys(piexifData).length > 0) {
    const piexifHeader = document.createElement("tr");
    piexifHeader.innerHTML =
      '<td colspan="2" style="background: #28a745; color: white; font-weight: bold;">Metadados Estruturados (PIEXIF)</td>';
    metadataTableBody.appendChild(piexifHeader);

    for (const [category, data] of Object.entries(piexifData)) {
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        const categoryHeader = document.createElement("tr");
        categoryHeader.innerHTML = `<td colspan="2" style="background: #6c757d; color: white; font-weight: bold;">${category}</td>`;
        metadataTableBody.appendChild(categoryHeader);

        for (const [key, value] of Object.entries(data)) {
          const row = document.createElement("tr");

          // Destacar seção GPS
          if (category === "GPS") {
            row.style.backgroundColor = "#fff3cd";
          }

          // Formatar o valor usando a nova função
          let displayValue = formatMetadataValue(key, value);

          // Truncar valores muito longos
          if (displayValue.length > 100) {
            displayValue = displayValue.substring(0, 100) + "...";
          }

          const valueCell = document.createElement("td");
          valueCell.textContent = displayValue;
          if (String(value).length > 50 || typeof value === "object") {
            valueCell.className = "long-value";
            valueCell.title = formatMetadataValue(key, value);
          }

          row.innerHTML = `<td style="padding-left: 20px;">${key}</td>`;
          row.appendChild(valueCell);
          metadataTableBody.appendChild(row);
        }
      }
    }
  }

  // Exibir mapa GPS se coordenadas foram encontradas (apenas para imagens)
  if (gpsCoords.latitude && gpsCoords.longitude) {
    // Remover mapa anterior se existir
    const existingMapContainer = document.getElementById("gps-map-container");
    if (existingMapContainer) {
      existingMapContainer.remove();
    }

    // Exibir mapa com informações de localização
    displayGPSMap(gpsCoords.latitude, gpsCoords.longitude);
  }
}

// Event listener para processar metadados
if (processButton) {
  processButton.addEventListener("click", async () => {
    if (!exifLoaded || !piexifLoaded) {
      alert(
        "As bibliotecas ainda não foram carregadas. Tente novamente em alguns segundos.",
      );
      return;
    }

    const file = imageUploadInput?.files[0];
    if (!file) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }

    if (uploadStatus) {
      uploadStatus.textContent = "Processando metadados...";
      uploadStatus.style.display = "block";
    }

    try {
      const fileType = getFileType(file);

      if (fileType === "image") {
        // Processar imagens com EXIF e piexif
        const exifData = await new Promise((resolve) => {
          window.EXIF.getData(file, function () {
            const allTags = window.EXIF.getAllTags(this);
            resolve(allTags);
          });
        });

        let piexifData = {};
        if (file.type === "image/jpeg") {
          const reader = new FileReader();
          piexifData = await new Promise((resolve, reject) => {
            reader.onload = function (e) {
              try {
                const data = window.piexif.load(e.target.result);
                resolve(data);
              } catch (error) {
                console.warn("Erro ao carregar dados piexif:", error);
                resolve({});
              }
            };
            reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
            reader.readAsDataURL(file);
          });
        }

        // Obter metadados básicos da imagem também
        const fileMetadata = await analyzeFileMetadata(file);
        displayMetadata(exifData, piexifData, fileMetadata);
      } else {
        // Processar outros tipos de arquivo
        const fileMetadata = await analyzeFileMetadata(file);
        displayMetadata({}, {}, fileMetadata);
      }

      if (metadataContainer) {
        metadataContainer.style.display = "block";
      }

      if (uploadStatus) {
        uploadStatus.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao processar metadados:", error);
      alert(
        "Ocorreu um erro ao processar os metadados. Verifique o arquivo e tente novamente.",
      );

      if (uploadStatus) {
        uploadStatus.style.display = "none";
      }
    }
  });
}
