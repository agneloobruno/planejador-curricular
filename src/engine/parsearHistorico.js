// Lê o PDF do histórico da UFMT e retorna array de disciplinas

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_PDF_PAGES = 80;

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();


export async function parsearHistorico(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true }).promise;

  if (pdf.numPages > MAX_PDF_PAGES) {
    throw new Error("PDF com muitas páginas. Limite de 80 páginas.");
  }

  let textoCompleto = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const pagina = await pdf.getPage(i);
    const conteudo = await pagina.getTextContent();
    const linhaPagina = conteudo.items.map(item => item.str).join(" ");
    textoCompleto += linhaPagina + "\n";
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