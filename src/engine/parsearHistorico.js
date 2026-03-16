// src/engine/parsearHistorico.js
// Lê o PDF do histórico da UFMT e retorna array de disciplinas

import * as pdfjsLib from "pdfjs-dist";

// Worker necessário para o pdfjs funcionar no browser
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

/**
 * Recebe um File (do input ou drag-and-drop) e retorna:
 * [{ nome, status, periodo, ch }]
 */
export async function parsearHistorico(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let textoCompleto = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const pagina = await pdf.getPage(i);
    const conteudo = await pagina.getTextContent();
    const linhaPagina = conteudo.items.map(item => item.str).join(" ");
    textoCompleto += linhaPagina + "\n";
  }

  // DEBUG TEMPORARIO — apaga depois
  console.log("=== TEXTO BRUTO DO PDF ===");
  console.log(textoCompleto.slice(0, 3000));
  console.log("==========================");

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

  // O histórico UFMT vem como um bloco corrido. O padrão real é:
  // PERIODO  SI  NOME DA DISCIPLINA  #CODIGO  [Obs: ...]  CH  CRÉDITOS  NOTA  FALTAS  STATUS
  // Exemplo: 20231  SI  ALGORITMOS I  #30829280  60  4  10.00  0  AP

  // Captura: período | nome | ch | nota | faltas | status
  const regex =
    /(\d{5})\s+SI\d*\s+([A-ZÁÉÍÓÚÀÃÕÇÂÊÎÔÛÜ][A-ZÁÉÍÓÚÀÃÕÇÂÊÎÔÛÜa-záéíóúàãõçâêîôûü0-9 :,\-\/]+?)\s+#\d+(?:[^#\n]*?)?\s+(\d{2,3})\s+\d+\s+([\d.]+)\s+(\d+)\s+(AP|RM|RMF|MA|NA)\b/g;

  let match;
  while ((match = regex.exec(texto)) !== null) {
    const periodo = match[1];
    const nome    = match[2].trim()
      // remove sufixos de "Obs:" que podem ter vazado no nome
      .replace(/\s+Obs:.*$/, "")
      .trim();
    const ch      = parseInt(match[3]);
    const status  = match[6];

    if (nome.length < 4) continue;
    // Ignora linhas de cabeçalho ou rodapé
    if (nome.includes("Histórico") || nome.includes("Período")) continue;

    disciplinas.push({ nome, ch, periodo, status });
  }

  // DEBUG — apaga depois
  const resultado = deduplicar(disciplinas);
  console.table(resultado);
  return resultado;
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