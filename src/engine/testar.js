// =============================================================
// src/engine/testar.js
// Rode com: node --input-type=module < src/engine/testar.js
// ou: node src/engine/testar.js  (se package.json tiver "type":"module")
// =============================================================

import { classificar } from "./classificar.js";

// Simulação do histórico real mencionado no documento
const historico = [
  // Aprovadas (AP)
  { nome: "Álgebra Linear",                     status: "AP", periodo: "20191" },
  { nome: "Tecnologia e Sociedade",             status: "AP", periodo: "20201" },
  { nome: "Algoritmos I",                       status: "AP", periodo: "20231" },
  { nome: "Fundamentos da Computação",          status: "AP", periodo: "20191" },
  { nome: "Algoritmos II",                      status: "AP", periodo: "20232" },
  { nome: "Interface Humano-Computador",        status: "AP", periodo: "20231" },
  { nome: "Banco de Dados",                     status: "AP", periodo: "20221" },
  { nome: "Engenharia de Software",             status: "AP", periodo: "20222" },
  { nome: "Estrutura de Dados",                 status: "AP", periodo: "20232" },
  { nome: "Programação em Ambiente Web I",      status: "AP", periodo: "20231" },
  { nome: "Sistemas de Informação",             status: "AP", periodo: "20222" },
  { nome: "Linguagem de Programação Visual",    status: "AP", periodo: "20231" },
  { nome: "Matemática Discreta",                status: "AP", periodo: "20201" },
  { nome: "Projeto de Banco de Dados",          status: "AP", periodo: "20232" },
  { nome: "Sistemas Operacionais",              status: "AP", periodo: "20222" },
  { nome: "Laboratório de Programação",         status: "AP", periodo: "20231" },
  { nome: "Teoria Geral de Sistemas",           status: "AP", periodo: "20211" },

  // NÃO aprovadas — não devem entrar como concluídas
  { nome: "Redes de Computadores",              status: "MA", periodo: "20241" },
  { nome: "Conceitos de Linguagens de Programação", status: "RM", periodo: "20221" },
];

const resultado = classificar(historico);

// ---- Exibe resultado formatado ----
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║         RESULTADO DO MOTOR DE EQUIVALÊNCIAS          ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

console.log(`📚 OBRIGATÓRIAS RECONHECIDAS (${resultado.obrigatorias.length})`);
console.log("─".repeat(56));
for (const d of resultado.obrigatorias.sort((a, b) => (a.semestre || 99) - (b.semestre || 99))) {
  const icone = d.selo === "parcial" ? "⚠️ " : "✅";
  console.log(`${icone} [${d.selo}] ${d.disciplinaNova} (${d.semestre}º sem)`);
  console.log(`      ← ${d.disciplinaAntiga}`);
  if (d.obs) console.log(`      ℹ️  ${d.obs}`);
}

console.log(`\n🎯 OPTATIVAS APROVEITADAS (${resultado.optativas.length})`);
console.log("─".repeat(56));
for (const d of resultado.optativas) {
  console.log(`✅ ${d.disciplinaNova}`);
  console.log(`      ← ${d.disciplinaAntiga}`);
}

console.log(`\n🔒 DISCIPLINAS BLOQUEADAS (${resultado.bloqueadas.length})`);
console.log("─".repeat(56));
for (const d of resultado.bloqueadas) {
  console.log(`❌ ${d.disciplinaAntiga} — ${d.motivo}`);
}

console.log(`\n🔓 DISCIPLINAS LIBERADAS PARA MATRÍCULA (${resultado.prereqsLiberados.length})`);
console.log("─".repeat(56));
console.log("  (pré-requisitos já satisfeitos, mas ainda não cursadas)");
for (const nome of resultado.prereqsLiberados) {
  console.log(`   → ${nome}`);
}

console.log("\n");