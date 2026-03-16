// =============================================================
// src/data/equivalencias.js
// Gerado a partir do PPC de Sistemas de Informação - UFMT 2026
// Seção 5.1 - Quadro de Equivalência dos Fluxos Curriculares
// =============================================================

// ---------------------------------------------------------------
// FLUXO NOVO — disciplinas obrigatórias por semestre + pré-req
// ---------------------------------------------------------------
export const fluxoNovo = [
  // 1º Semestre (sem pré-requisitos)
  { nome: "Arquitetura e Organização de Computadores", semestre: 1, ch: 64, prereqs: [] },
  { nome: "Algoritmos I",                              semestre: 1, ch: 96, prereqs: [] },
  { nome: "Lógica",                                   semestre: 1, ch: 64, prereqs: [] },
  { nome: "Pré-Cálculo",                              semestre: 1, ch: 32, prereqs: [] },
  { nome: "Fundamentos de Sistemas de Informação",    semestre: 1, ch: 64, prereqs: [] },

  // 2º Semestre
  { nome: "Algoritmos II",             semestre: 2, ch: 96, prereqs: ["Algoritmos I"] },
  { nome: "Tecnologia e Sociedade",    semestre: 2, ch: 64, prereqs: [] },
  { nome: "Teoria Geral da Administração I", semestre: 2, ch: 64, prereqs: [] },
  { nome: "Probabilidade e Estatística", semestre: 2, ch: 64, prereqs: ["Pré-Cálculo"] },
  { nome: "Álgebra Linear I",          semestre: 2, ch: 64, prereqs: ["Pré-Cálculo"] },

  // 3º Semestre
  { nome: "Estrutura de Dados",        semestre: 3, ch: 64, prereqs: ["Algoritmos II"] },
  { nome: "Engenharia de Software",    semestre: 3, ch: 64, prereqs: ["Fundamentos de Sistemas de Informação"] },
  { nome: "Programação Orientada a Objeto", semestre: 3, ch: 64, prereqs: ["Algoritmos II"] },
  { nome: "Sistemas Operacionais",     semestre: 3, ch: 64, prereqs: ["Arquitetura e Organização de Computadores"] },
  { nome: "Banco de Dados",            semestre: 3, ch: 64, prereqs: [] },

  // 4º Semestre
  { nome: "Inteligência Artificial",   semestre: 4, ch: 64, prereqs: ["Algoritmos II"] },
  { nome: "Redes de Computadores I",   semestre: 4, ch: 64, prereqs: ["Arquitetura e Organização de Computadores"] },
  { nome: "Ética e Legislação Aplicada a Sistemas de Informação", semestre: 4, ch: 64, prereqs: [] },
  { nome: "Análise e Projeto de Sistemas", semestre: 4, ch: 64, prereqs: ["Engenharia de Software"] },
  { nome: "Governança de TI",          semestre: 4, ch: 64, prereqs: ["Fundamentos de Sistemas de Informação"] },

  // 5º Semestre
  { nome: "Gestão de Sistemas de Informação Empresariais", semestre: 5, ch: 64, prereqs: ["Fundamentos de Sistemas de Informação"] },
  { nome: "Segurança em Sistemas de Informação", semestre: 5, ch: 64, prereqs: ["Redes de Computadores I"] },
  { nome: "Interação Humano-Computador", semestre: 5, ch: 64, prereqs: ["Engenharia de Software"] },
  { nome: "Desenvolvimento de Aplicações Web", semestre: 5, ch: 64, prereqs: ["Programação Orientada a Objeto"] },
  { nome: "Gerência de Projetos",      semestre: 5, ch: 64, prereqs: ["Engenharia de Software"] },

  // 6º Semestre
  { nome: "Desenvolvimento de Sistemas de Informação Distribuídos", semestre: 6, ch: 64, prereqs: ["Redes de Computadores I", "Desenvolvimento de Aplicações Web"] },
  { nome: "Inteligência de Negócios",  semestre: 6, ch: 64, prereqs: ["Banco de Dados"] },
  { nome: "Projeto de Pesquisa e Inovação", semestre: 6, ch: 64, prereqs: ["Desenvolvimento de Aplicações Web", "Engenharia de Software"] },
  { nome: "Auditoria em Sistemas de Informação", semestre: 6, ch: 64, prereqs: ["Fundamentos de Sistemas de Informação"] },
  { nome: "Infraestrutura de Software", semestre: 6, ch: 64, prereqs: ["Segurança em Sistemas de Informação"] },

  // 7º Semestre
  { nome: "Empreendedorismo, Inovação e Computação", semestre: 7, ch: 64, prereqs: [] },
  { nome: "Projeto de Conclusão de Curso I", semestre: 7, ch: 64, prereqs: ["Projeto de Pesquisa e Inovação"] },
  // Optativas I, II, III ficam nos slots de optativas

  // 8º Semestre
  { nome: "Projeto de Conclusão de Curso II", semestre: 8, ch: 64, prereqs: ["Projeto de Conclusão de Curso I"] },
  // Optativas IV–VII ficam nos slots de optativas
];

// ---------------------------------------------------------------
// TABELA DE EQUIVALÊNCIAS
// Fonte: Seção 5.1 do PPC (páginas 95-105)
// tipo: "obrigatoria" | "optativa"
// aproveitamento: "total" | "parcial"
// ---------------------------------------------------------------
export const equivalencias = [
  // --- Obrigatórias com aproveitamento TOTAL ---
  { antiga: "Álgebra Linear",                     nova: "Álgebra Linear I",                                      tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Fundamentos da Computação",          nova: "Arquitetura e Organização de Computadores",             tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Lógica",                             nova: "Lógica",                                                tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Tecnologia e Sociedade",             nova: "Tecnologia e Sociedade",                                tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Matemática Discreta",                nova: "Pré-Cálculo",                                           tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Teoria das Organizações",            nova: "Teoria Geral da Administração I",                       tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Estrutura de Dados",                 nova: "Estrutura de Dados",                                    tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Algoritmos III",                     nova: "Programação Orientada a Objetos",                       tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Banco de Dados",                     nova: "Banco de Dados",                                        tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Probabilidade e Estatística",        nova: "Probabilidade e Estatística",                           tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Sistemas Operacionais",              nova: "Sistemas Operacionais",                                 tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Engenharia de Software",             nova: "Engenharia de Software",                                tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Teoria Geral de Sistemas",           nova: "Fundamentos de Sistemas de Informação",                 tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Sistemas de Informação",             nova: "Gestão de Sistemas de Informação Empresariais",         tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Análise e Projeto de Sistemas I",    nova: "Análise e Projeto de Sistemas",                         tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Interface Humano-Computador",        nova: "Interação Humano-Computador",                           tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Programação em Ambiente Web I",      nova: "Desenvolvimento de Aplicações Web",                     tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Redes de Computadores",              nova: "Redes de Computadores I",                               tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Inteligência Artificial",            nova: "Inteligência Artificial",                               tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Gerência de Projetos",               nova: "Gerência de Projetos",                                  tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Programação em Ambiente Web II",     nova: "Infraestrutura de Software",                            tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Análise e Projeto de Sistemas II",   nova: "Projeto de Pesquisa e Inovação",                        tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Empreendedorismo em Informática",    nova: "Empreendedorismo, Inovação e Computação",               tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Sistemas à Decisão",                 nova: "Inteligência de Negócios",                              tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Segurança em Redes e Internet",      nova: "Segurança em Sistemas de Informação",                   tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Sistemas Distribuídos",              nova: "Desenvolvimento de Sistemas de Informação Distribuídos", tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Auditoria e Segurança em Sistemas de Informação", nova: "Auditoria em Sistemas de Informação",      tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Ética",                              nova: "Ética e Legislação Aplicada a Sistemas de Informação",  tipo: "obrigatoria", aproveitamento: "total" },
  { antiga: "Estágio Supervisionado",             nova: "Projeto de Conclusão de Curso I",                       tipo: "obrigatoria", aproveitamento: "total" },

  // --- Obrigatórias com aproveitamento PARCIAL ---
  // (Algoritmos I/II isolados = parcial; o caso completo é tratado em CASO_ALGORITMOS)
  { antiga: "Algoritmos I",  nova: "Algoritmos I",  tipo: "obrigatoria", aproveitamento: "parcial" },
  { antiga: "Algoritmos II", nova: "Algoritmos II", tipo: "obrigatoria", aproveitamento: "parcial" },

  // --- Viram OPTATIVAS (Tópicos Especiais e outras) ---
  { antiga: "Contabilidade Geral",                 nova: "Tópicos Especiais em Administração e Contabilidade I",  tipo: "optativa", aproveitamento: "total" },
  { antiga: "Laboratório de Programação",          nova: "Tópicos Especiais em Algoritmos e Programação I",       tipo: "optativa", aproveitamento: "total" },
  { antiga: "Laboratório de Banco de Dados",       nova: "Tópicos Especiais em Banco de Dados I",                 tipo: "optativa", aproveitamento: "total" },
  { antiga: "Linguagem de Programação Visual",     nova: "Tópicos Especiais em Algoritmos e Programação II",      tipo: "optativa", aproveitamento: "total" },
  { antiga: "Arquitetura de Computadores",         nova: "Tópicos Especiais em Arquitetura de Computadores I",    tipo: "optativa", aproveitamento: "total" },
  { antiga: "Sistemas Multimídia",                 nova: "Tópicos Especiais em Desenvolvimento de Sistemas I",    tipo: "optativa", aproveitamento: "total" },
  { antiga: "Comércio Eletrônico",                 nova: "Tópicos Especiais em Desenvolvimento de Sistemas I",    tipo: "optativa", aproveitamento: "total" },
  { antiga: "Administração e Gerência de Redes",   nova: "Tópicos Especiais em Redes de Computadores I",          tipo: "optativa", aproveitamento: "total" },
  { antiga: "Informática aplicada à Educação",     nova: "Tópicos Especiais em Educação e Informática I",         tipo: "optativa", aproveitamento: "total" },
  { antiga: "Criptografia e Segurança de Dados",   nova: "Tópicos Especiais em Algoritmos e Programação III",     tipo: "optativa", aproveitamento: "total" },
  { antiga: "Banco de Dados Não-Convencionais",    nova: "Tópicos Especiais em Banco de Dados I",                 tipo: "optativa", aproveitamento: "total" },
  { antiga: "Gestão de Pessoas",                   nova: "Tópicos Especiais em Administração e Contabilidade II", tipo: "optativa", aproveitamento: "total" },
  { antiga: "Integração de Dados",                 nova: "Tópicos Especiais em Banco de Dados II",                tipo: "optativa", aproveitamento: "total" },
  { antiga: "Organização, Sistemas e Métodos",     nova: "Tópicos Especiais em Administração e Contabilidade III", tipo: "optativa", aproveitamento: "total" },
  { antiga: "Processamento de Imagens",            nova: "Tópicos Especiais em Computação Gráfica I",             tipo: "optativa", aproveitamento: "total" },
  { antiga: "Projeto de Banco de Dados",           nova: "Tópicos Especiais em Banco de Dados III",               tipo: "optativa", aproveitamento: "total" },
  { antiga: "Realidade Virtual",                   nova: "Tópicos Especiais em Computação Gráfica II",            tipo: "optativa", aproveitamento: "total" },
  { antiga: "Tópicos Especiais em Banco de Dados", nova: "Tópicos Especiais em Banco de Dados IV",                tipo: "optativa", aproveitamento: "total" },
  { antiga: "Construção de Gerenciadores",         nova: "Tópicos Especiais em Sistemas de Informação I",         tipo: "optativa", aproveitamento: "total" },
  { antiga: "Tópicos Especiais em Engenharia de Software", nova: "Tópicos Especiais em Engenharia de Software I", tipo: "optativa", aproveitamento: "total" },
  { antiga: "Tópicos Especiais em Sistemas de Informação", nova: "Tópicos Especiais em Sistemas de Informação II", tipo: "optativa", aproveitamento: "total" },
  { antiga: "Computação Móvel",                    nova: "Tópicos Especiais em Redes de Computadores II",         tipo: "optativa", aproveitamento: "total" },
  { antiga: "Introdução aos Sistemas Inteligentes", nova: "Tópicos Especiais em Inteligência Artificial I",       tipo: "optativa", aproveitamento: "total" },
  { antiga: "Introdução às Redes Neurais",         nova: "Tópicos Especiais em Inteligência Artificial II",       tipo: "optativa", aproveitamento: "total" },
  { antiga: "Mineração de Dados",                  nova: "Ciência de Dados",                                      tipo: "optativa", aproveitamento: "total" },
  { antiga: "Tópicos Especiais em Inteligência Artificial", nova: "Tópicos Especiais em Inteligência Artificial III", tipo: "optativa", aproveitamento: "total" },
  { antiga: "Tópicos Especiais em Redes de Computadores", nova: "Tópicos Especiais em Redes de Computadores II",  tipo: "optativa", aproveitamento: "total" },
  { antiga: "Projeto e Análise de Algoritmos",     nova: "Projeto e Análise de Algoritmos",                       tipo: "optativa", aproveitamento: "total" },
  { antiga: "História da Computação",              nova: "História da Computação",                                tipo: "optativa", aproveitamento: "total" },
  { antiga: "Conceitos de Linguagens de Programação", nova: "Conceitos de Linguagens de Programação",             tipo: "optativa", aproveitamento: "total" },
  { antiga: "Métodos Computacionais",              nova: "Métodos Computacionais",                                tipo: "optativa", aproveitamento: "total" },
  { antiga: "Computação Gráfica",                  nova: "Computação Gráfica",                                    tipo: "optativa", aproveitamento: "total" },
  { antiga: "Leitura e Produção de Textos: Gêneros Acadêmicos", nova: "Optativa Livre", tipo: "optativa", aproveitamento: "total" },
];

// ---------------------------------------------------------------
// CASO ESPECIAL: Algoritmos I + II + Lab. de Programação
// PPC p.105: se o aluno integralizou os três no fluxo antigo,
// aproveita Algoritmos I e II no novo como aproveitamento TOTAL,
// mas NÃO aproveita Lab. de Programação como Tópicos Especiais.
// ---------------------------------------------------------------
export const CASO_ALGORITMOS = {
  exige: ["Algoritmos I", "Algoritmos II", "Laboratório de Programação"],
  aproveitam: [
    { antiga: "Algoritmos I",  nova: "Algoritmos I",  tipo: "obrigatoria" },
    { antiga: "Algoritmos II", nova: "Algoritmos II", tipo: "obrigatoria" },
  ],
  naoAproveita: "Laboratório de Programação",
};

// ---------------------------------------------------------------
// STATUS VÁLIDOS E INVÁLIDOS
// ---------------------------------------------------------------
export const STATUS_APROVADO  = ["AP", "AE", "APM", "APO"];
export const STATUS_INVALIDOS = ["RM", "RMF", "MA", "NA"];