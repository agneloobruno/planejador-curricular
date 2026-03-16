// =============================================================
// src/engine/classificar.js
// Motor de equivalências baseado no PPC UFMT 2026 - Seção 5.1
// =============================================================

import {
  equivalencias,
  fluxoNovo,
  CASO_ALGORITMOS,
  STATUS_APROVADO,
} from "../data/equivalencias.js";

// ---------------------------------------------------------------
// classificar(historico)
//
// Recebe o histórico do aluno como array de objetos:
//   [{ nome: "Banco de Dados", status: "AP", periodo: "20221" }]
//
// Retorna um objeto com três listas:
//   {
//     obrigatorias: [{ disciplinaNova, disciplinaAntiga, semestre, selo }],
//     optativas:    [{ disciplinaNova, disciplinaAntiga, selo }],
//     bloqueadas:   [{ disciplinaAntiga, status, motivo }],
//     prereqsLiberados: ["nome da disciplina", ...]   ← já pode cursar
//   }
//
// Selos possíveis:
//   "concluida_historico"    — AP com nome igual ao PPC novo (sem equivalência)
//   "concluida_equivalencia" — AP por equivalência do fluxo antigo
//   "parcial"                — aproveitamento parcial (ex: Algoritmos I/II isolados)
//   "optativa_aproveitada"   — vira crédito de optativa/tópico especial
//   "bloqueada"              — status inválido (RM, RMF, MA, NA)
// ---------------------------------------------------------------

// Aliases: como o PDF escreve → nome canônico da tabela de equivalências
const ALIASES = {
  "teoria geral dos sistemas":              "Teoria Geral de Sistemas",
  "teoria das organizacoes":                "Teoria das Organizações",
  "organizacao sistemas e metodos":         "Organização, Sistemas e Métodos",
  "probabilidade e estatistica":            "Probabilidade e Estatística",
  "algebra linear":                         "Álgebra Linear",
  "logica":                                 "Lógica",
  "fundamentos da computacao":              "Fundamentos da Computação",
  "gestao de pessoas":                      "Gestão de Pessoas",
  "informatica aplicada a educacao":        "Informática aplicada à Educação",
  "interface humano-computador":            "Interface Humano-Computador",
  "topicos especiais em banco de dados":    "Tópicos Especiais em Banco de Dados",
  "topicos especiais em engenharia de software": "Tópicos Especiais em Engenharia de Software",
  "laboratorio de programacao":             "Laboratório de Programação",
  "laboratorio de banco de dados":          "Laboratório de Banco de Dados",
  "algoritmos iii":                         "Algoritmos III",
  "linguagem de programacao visual":        "Linguagem de Programação Visual",
  "matematica discreta":                    "Matemática Discreta",
  "programacao em ambiente web i":          "Programação em Ambiente Web I",
  "programacao em ambiente web ii":         "Programação em Ambiente Web II",
  "projeto de banco de dados":              "Projeto de Banco de Dados",
  "sistemas operacionais":                  "Sistemas Operacionais",
  "engenharia de software":                 "Engenharia de Software",
  "banco de dados":                         "Banco de Dados",
  "estrutura de dados":                     "Estrutura de Dados",
  "sistemas a decisao":                     "Sistemas à Decisão",
  "arquitetura de computadores":            "Arquitetura de Computadores",
  "arquitetura de computadores i":          "Arquitetura de Computadores",
  "sistemas de informacao":                 "Sistemas de Informação",
  "inteligencia artificial":                "Inteligência Artificial",
  "gerencia de projetos":                   "Gerência de Projetos",
  "empreendedorismo em informatica":        "Empreendedorismo em Informática",
  "criptografia e seguranca de dados":      "Criptografia e Segurança de Dados",
  "tecnologia e sociedade":                 "Tecnologia e Sociedade",
  "algoritmos i":                           "Algoritmos I",
  "algoritmos ii":                          "Algoritmos II",
  "contabilidade geral":                    "Contabilidade Geral",
  "historia da computacao":                 "História da Computação",
  "economia":                               "Economia",
};

// Substitui a função normalizarNome existente por essa:
function normalizarNome(nome) {
  const limpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, " ")
    .trim();

  // Se tem alias, retorna o nome canônico normalizado
  const canonical = ALIASES[limpo];
  if (canonical) {
    return canonical
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  return limpo;
}

export function classificar(historico) {
  // 1. Separa aprovadas das bloqueadas
  const aprovadas   = historico.filter(d => STATUS_APROVADO.includes(d.status));
  const nomesAprovados = aprovadas.map(d => normalizarNome(d.nome));

  // 2. Verifica o caso especial de Algoritmos
  const temCasoAlgoritmos = CASO_ALGORITMOS.exige.every(
    nome => nomesAprovados.includes(normalizarNome(nome))
  );

  // Lista de disciplinas que o caso especial bloqueia de virar optativa
  const bloqueadosPorAlgoritmos = temCasoAlgoritmos
    ? [normalizarNome(CASO_ALGORITMOS.naoAproveita)]
    : [];

  const obrigatorias = [];
  const optativas    = [];
  const jaProcessadas = new Set(); // evitar duplicatas

  // 3. Processa cada equivalência da tabela
  for (const eq of equivalencias) {
    const nomeAntNorm = normalizarNome(eq.antiga);
    const foiAprovada = nomesAprovados.includes(nomeAntNorm);

    if (!foiAprovada) continue;
    if (jaProcessadas.has(nomeAntNorm)) continue;

    // Caso especial: Algoritmos I/II isolados são parciais
    // Mas se o caso completo foi ativado, vira total (tratado abaixo)
    if (
      (normalizarNome(eq.antiga) === "algoritmos i" ||
       normalizarNome(eq.antiga) === "algoritmos ii") &&
      !temCasoAlgoritmos
    ) {
      // Aproveitamento parcial — registra mas marca como parcial
      obrigatorias.push({
        disciplinaAntiga: eq.antiga,
        disciplinaNova:   eq.nova,
        semestre:         getSemestre(eq.nova),
        selo:             "parcial",
        obs:              "Aproveitamento parcial. Requer complementação de 32h práticas.",
      });
      jaProcessadas.add(nomeAntNorm);
      continue;
    }

    // Bloqueado pelo caso especial de Algoritmos
    if (bloqueadosPorAlgoritmos.includes(nomeAntNorm)) continue;

    jaProcessadas.add(nomeAntNorm);

    if (eq.tipo === "obrigatoria") {
      obrigatorias.push({
        disciplinaAntiga: eq.antiga,
        disciplinaNova:   eq.nova,
        semestre:         getSemestre(eq.nova),
        selo:             "concluida_equivalencia",
      });
    } else {
      optativas.push({
        disciplinaAntiga: eq.antiga,
        disciplinaNova:   eq.nova,
        selo:             "optativa_aproveitada",
      });
    }
  }

  // 4. Adiciona Algoritmos I e II com aproveitamento total (caso especial completo)
  if (temCasoAlgoritmos) {
    for (const eq of CASO_ALGORITMOS.aproveitam) {
      const nomeNorm = normalizarNome(eq.antiga);
      if (!jaProcessadas.has(nomeNorm)) {
        obrigatorias.push({
          disciplinaAntiga: eq.antiga,
          disciplinaNova:   eq.nova,
          semestre:         getSemestre(eq.nova),
          selo:             "concluida_equivalencia",
          obs:              "Caso especial: trio Algoritmos I + II + Lab. Programação. Requer 32h práticas.",
        });
        jaProcessadas.add(nomeNorm);
      }
    }
  }

  // 5. Disciplinas com status inválido → bloqueadas
  // Reprovadas ficam registradas mas não vão para bloqueadas
  // A interface decide o que mostrar com base nos pré-requisitos

  // 6. Calcula quais disciplinas do PPC novo já estão liberadas (pré-req satisfeitos)
  const concluidasNoPPCNovo = new Set(obrigatorias
    .filter(d => d.selo === "concluida_equivalencia" || d.selo === "parcial")
    .map(d => d.disciplinaNova)
  );

  const prereqsLiberados = fluxoNovo
    .filter(d => {
      // Já concluída — não precisa listar
      if (concluidasNoPPCNovo.has(d.nome)) return false;
      // Todos os pré-requisitos satisfeitos?
      return d.prereqs.every(p => concluidasNoPPCNovo.has(p));
    })
    .map(d => d.nome);

  return { obrigatorias, optativas, bloqueadas: [], prereqsLiberados };
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------


// Retorna semestre da disciplina no fluxo novo (ou null se não encontrar)
function getSemestre(nomeDisciplina) {
  const disc = fluxoNovo.find(
    d => normalizarNome(d.nome) === normalizarNome(nomeDisciplina)
  );
  return disc ? disc.semestre : null;
}