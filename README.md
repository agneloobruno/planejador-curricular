# 🎓 Planejador Curricular
### UFMT · Sistemas de Informação · PPC 2026

> Faça upload do seu histórico acadêmico em PDF e descubra automaticamente quais disciplinas do novo PPC você já pode aproveitar, quais estão liberadas para matrícula e o que ainda falta.

---

## ✦ O que faz

O app lê o seu histórico escolar em PDF diretamente no navegador — sem enviar nada para nenhum servidor — e cruza as disciplinas cursadas com a tabela de equivalências do PPC 2026, aplicando todas as regras definidas na Seção 5.1 do documento oficial.

O resultado é uma grade visual completa com cada disciplina classificada por situação:

| Símbolo | Situação | Descrição |
|---------|----------|-----------|
| `✦` | Concluída por equivalência | Aprovada no fluxo antigo com equivalência no PPC novo |
| `✓` | Concluída (histórico) | Aprovada com o mesmo nome no PPC novo |
| `◑` | Aproveitamento parcial | Equivalência parcial — requer complementação de horas |
| `→` | Liberada para matrícula | Pré-requisitos satisfeitos, ainda não cursada |
| `○` | Bloqueada | Pré-requisito pendente ou status inválido (RM, RMF, MA) |
| `·` | Não cursada | Ainda não foi cursada e pré-req não satisfeito |

---

## ⚙️ Como funciona

O app é dividido em três camadas independentes:

```
PDF do histórico
      ↓
  parsearHistorico.js   →  extrai disciplinas + status + período
      ↓
  classificar.js        →  cruza com tabela de equivalências do PPC
      ↓
  GradeCurricular.jsx   →  exibe grade por semestre + visão por situação
```

### Regras implementadas

- Só disciplinas com status `AP` contam como concluídas
- Status `RM`, `RMF`, `MA` e `NA` são bloqueados
- Se uma disciplina foi cursada mais de uma vez, o AP prevalece sobre qualquer reprovação
- **Caso especial de Algoritmos** (PPC p.105): se o aluno integralizou Algoritmos I + Algoritmos II + Laboratório de Programação no fluxo antigo, aproveita os dois primeiros como obrigatórias no novo — mas Laboratório de Programação **não** pode ser aproveitado como Tópicos Especiais em Algoritmos e Programação I nesse mesmo caso
- Algoritmos I e II aproveitados isoladamente são marcados como **parciais** — requerem complementação de 32h práticas cada

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 18+ instalado.

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/planejador-curricular.git
cd planejador-curricular

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` e faça o upload do seu histórico.

---

## 🗂️ Estrutura do projeto

```
src/
├── data/
│   └── equivalencias.js      # Tabela completa do PPC 2026 (Seção 5.1)
│                             # + fluxo curricular com pré-requisitos
├── engine/
│   ├── classificar.js        # Motor de equivalências e pré-requisitos
│   └── parsearHistorico.js   # Parser do PDF do histórico UFMT
├── components/
│   └── GradeCurricular.jsx   # Interface visual da grade
├── App.jsx                   # Upload + orquestração
└── index.css                 # Tema dark/light + animações
```

---

## 🧠 A engine em detalhe

O `classificar.js` recebe o histórico como array e devolve quatro listas:

```js
const { obrigatorias, optativas, bloqueadas, prereqsLiberados } = classificar(historico);
```

Para testar a engine sem a interface, rode:

```bash
node src/engine/testar.js
```

O arquivo `testar.js` simula um histórico manual e imprime o resultado formatado no terminal — útil para depurar equivalências sem precisar abrir o browser.

---

## 📋 Tecnologias

- **React** + **Vite** — interface e build
- **pdfjs-dist** — leitura do PDF inteiramente no browser
- **CSS puro** — dark mode automático via `prefers-color-scheme`, animações com `@keyframes`
- Zero dependências de UI — nenhum Tailwind, nenhum component library

---

## 📄 Base documental

Toda a lógica de equivalências foi extraída diretamente do documento oficial:

> **Projeto Pedagógico de Curso de Graduação — Sistemas de Informação — UFMT**
> Bacharelado · 2026–2032 · Campus Universitário de Cuiabá
> Seção 5.1 — Quadro de Equivalência dos Fluxos Curriculares (pp. 95–105)

---

## 🤝 Contribuindo

Encontrou uma equivalência errada ou faltando? Abre uma issue com o nome da disciplina no fluxo antigo, o nome no PPC novo e a página do documento onde consta.

Pull requests são bem-vindos — especialmente para cobrir casos de migração de outros anos de ingresso (2023/1, 2024/1, 2025/1).

---

<p align="center">
  Feito com <code>node src/engine/testar.js</code> e muita determinação
</p>