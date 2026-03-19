// Lê o PDF do histórico da UFMT e retorna array de disciplinas

const MAX_PDF_PAGES = 80;

function criarErro(codigo, mensagem, cause) {
  const erro = new Error(mensagem);
  erro.code = codigo;
  if (cause !== undefined) {
    erro.cause = cause;
  }
  return erro;
}

async function lerArquivoComoArrayBuffer(file) {
  if (file && typeof file.arrayBuffer === "function") {
    return file.arrayBuffer();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo selecionado."));
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  });
}

async function carregarPdfJsLegacy() {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  return pdfjsLib;
}

function validarCabecalhoPdf(bytes) {
  if (!bytes || bytes.length < 4) {
    throw criarErro(
      "E_PDF_INCOMPLETO",
      "Arquivo inválido ou incompleto. Tente baixar/salvar o PDF localmente e reenviar."
    );
  }

  const ehPdf =
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46;   // F

  if (!ehPdf) {
    throw criarErro("E_PDF_HEADER", "O arquivo selecionado não parece ser um PDF válido.");
  }
}


export async function parsearHistorico(file) {
  let arrayBuffer;
  try {
    arrayBuffer = await lerArquivoComoArrayBuffer(file);
  } catch (e) {
    throw criarErro("E_FILE_READ", "Falha ao ler o arquivo selecionado.", e);
  }

  const bytes = new Uint8Array(arrayBuffer);
  validarCabecalhoPdf(bytes);
  const pdfjsLib = await carregarPdfJsLegacy();
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: bytes, disableWorker: true }).promise;
  } catch (e) {
    throw criarErro(
      "E_PDF_PARSE",
      "Falha ao processar o PDF. Tente salvar o arquivo localmente no dispositivo e reenviar.",
      e
    );
  }

  if (pdf.numPages > MAX_PDF_PAGES) {
    throw new Error("PDF com muitas páginas. Limite de 80 páginas.");
  }

  let textoCompleto = "";

  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const pagina = await pdf.getPage(i);
      const conteudo = await pagina.getTextContent();
      const linhaPagina = conteudo.items.map(item => item.str).join(" ");
      textoCompleto += linhaPagina + "\n";
    }
  } catch (e) {
    throw criarErro("E_PDF_TEXT", "Falha ao extrair texto do PDF.", e);
  }

  if (import.meta.env.DEV) {
    console.log("TAMANHO DO TEXTO:", textoCompleto.length);
    console.log("PRIMEIRAS 1000 CHARS:", JSON.stringify(textoCompleto.slice(0, 1000)));
  }

  return extrairDisciplinas(textoCompleto);
  
}

/**
 * Interpreta o texto extraído do histórico da UFMT.
 * O histórico tem linhas no formato:
 *   NOME DA DISCIPLINA   CH   PERÍODO   STATUS
 * Exemplo:
 *   Banco de Dados   60   2022/1   AP
 */
function extrairDisciplinas(texto) {
  const disciplinas = [];

  // Tenta o formato com código SI/SI1/SI2/CV no início
  const regexComCodigo =
    /(\d{5})\s+(?:SI\d*|CV|LLB|cv)\s+(.+?)\s+#\d+(?:[^#\n]*?)?\s+(\d{2,3})\s+\d+\s+[\d.]+\s+\d+\s+(AP|AE|APM|APO|RM|RMF|RF|MA|NA|RP|RMM)\b/g;

  let match;
  while ((match = regexComCodigo.exec(texto)) !== null) {
    const periodo = match[1];
    const nome    = match[2].trim().replace(/\s+Obs:.*$/, "").trim();
    const ch      = parseInt(match[3]);
    const status  = match[4];
    if (nome.length < 4) continue;
    disciplinas.push({ nome, ch, periodo, status });
  }

  // Se não achou nada, tenta formato sem código (PDF renderizado diferente)
  if (disciplinas.length === 0) {
    const regexSemCodigo =
      /(\d{5})\s+([A-ZÁÉÍÓÚÀÃÕÇÂÊÎÔÛÜ][A-ZÁÉÍÓÚÀÃÕÇÂÊÎÔÛÜa-záéíóúàãõçâêîôûü0-9 :,\-/]+?)\s+#\d+(?:[^#\n]*?)?\s+(\d{2,3})\s+\d+\s+[\d.]+\s+\d+\s+(AP|AE|APM|APO|RM|RMF|RF|MA|NA|RP|RMM)\b/g;

    while ((match = regexSemCodigo.exec(texto)) !== null) {
      const periodo = match[1];
      const nome    = match[2].trim().replace(/\s+Obs:.*$/, "").trim();
      const ch      = parseInt(match[3]);
      const status  = match[4];
      if (nome.length < 4) continue;
      disciplinas.push({ nome, ch, periodo, status });
    }
  }

  return deduplicar(disciplinas);
}

function deduplicar(disciplinas) {
  const mapa = new Map();

  for (const d of disciplinas) {
    const chave = d.nome.toLowerCase().trim();
    const atual = mapa.get(chave);

    // Mantém a entrada mais recente (período maior)
    if (!atual || d.periodo > atual.periodo) {
      mapa.set(chave, d);
    }
  }

  return Array.from(mapa.values());
}