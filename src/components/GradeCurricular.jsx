import { useState } from "react";
import { fluxoNovo } from "../data/equivalencias";

const SELOS = {
  concluida_equivalencia: { cor: "var(--purple)", bg: "var(--purple-bg)", icone: "✦", label: "Aprovada por Equivalência" },
  concluida_historico:    { cor: "var(--green)",  bg: "var(--green-bg)",  icone: "✓", label: "Aprovada"   },
  parcial:                { cor: "var(--amber)",  bg: "var(--amber-bg)",  icone: "◑", label: "Parcial"     },
  optativa_aproveitada:   { cor: "var(--blue)",   bg: "var(--blue-bg)",   icone: "◈", label: "Optativa"    },
  liberada:               { cor: "var(--amber)",  bg: "var(--amber-bg)",  icone: "→", label: "Liberada"    },
  bloqueada:              { cor: "var(--red)",    bg: "var(--red-bg)",    icone: "○", label: "Bloqueada"   },
  pendente:               { cor: "var(--muted)",  bg: "var(--bg3)",       icone: "·", label: "Não cursada" },
};

const CONTADORES = [
  { key: "obrigatorias", label: "Concluídas",  cor: "var(--green)"  },
  { key: "optativas",    label: "Optativas",   cor: "var(--purple)" },
  { key: "liberadas",    label: "Liberadas",   cor: "var(--amber)"  },
  { key: "bloqueadas",   label: "Bloqueadas",  cor: "var(--red)"    },
];

function ChipOptativa({ item, s }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        padding: expanded ? "8px 12px" : "5px 12px",
        borderRadius: expanded ? "10px" : "99px",
        fontSize: "12px",
        background: s.bg, color: s.cor,
        border: `1px solid ${s.cor}`,
        cursor: "pointer",
        transition: "all .2s",
        userSelect: "none",
      }}
    >
      {item.disciplinaNova}
      {expanded && (
        <div style={{
          fontSize: "11px", color: s.cor, opacity: .75,
          marginTop: "4px", paddingTop: "4px",
          borderTop: `1px solid ${s.cor}`,
        }}>
          ← {item.disciplinaAntiga}
        </div>
      )}
    </div>
  );
}

export default function GradeCurricular({ resultado, onReset }) {
  const [aba, setAba] = useState("grade");
  const [hover, setHover] = useState(null);

  const mapaSelos = {};
  for (const d of resultado.obrigatorias)
    mapaSelos[d.disciplinaNova] = { selo: d.selo, antiga: d.disciplinaAntiga, obs: d.obs };
  for (const nome of resultado.prereqsLiberados)
    if (!mapaSelos[nome]) mapaSelos[nome] = { selo: "liberada" };

  function getSelo(nome) {
    if (mapaSelos[nome]) return mapaSelos[nome];

    if (resultado.prereqsLiberados.includes(nome))
      return { selo: "liberada" };

    const bloqueada = resultado.bloqueadas.find(d => d.disciplinaAntiga === nome);
    if (bloqueada)
      return { selo: "bloqueada", obs: bloqueada.motivo };

    return { selo: "pendente" };
  }

  const porSemestre = {};
  for (const d of fluxoNovo) {
    if (!porSemestre[d.semestre]) porSemestre[d.semestre] = [];
    porSemestre[d.semestre].push(d);
  }

  const nums = {
    obrigatorias: resultado.obrigatorias.filter(d =>
      d.selo === "concluida_equivalencia" || d.selo === "concluida_historico"
    ).length,
    optativas:    resultado.optativas.length,
    liberadas:    resultado.prereqsLiberados.length,
    bloqueadas:   resultado.bloqueadas.length,
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "32px", animation: "fadeUp .4s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "var(--purple-bg)", border: "1px solid var(--purple)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>🎓</div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>Planejador Curricular</h1>
            <p style={{ fontSize: "12px", color: "var(--muted)" }}>PPC 2026 · Sistemas de Informação · UFMT</p>
          </div>
        </div>
        <button onClick={onReset} style={{
          padding: "6px 14px", borderRadius: "99px", fontSize: "12px",
          background: "transparent", color: "var(--muted)",
          border: "1px solid var(--border2)", cursor: "pointer",
        }}>
          ← Novo histórico
        </button>
      </div>

      {/* Contadores */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px", marginBottom: "28px",
        animation: "fadeUp .4s .05s ease both", opacity: 0, animationFillMode: "forwards",
      }}>
        {CONTADORES.map(c => (
          <div key={c.key} style={{
            padding: "20px", borderRadius: "var(--radius)",
            background: "var(--bg2)", border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "32px", fontWeight: 600, color: c.cor, fontFamily: "var(--mono)" }}>
              {nums[c.key]}
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "20px",
        background: "var(--bg2)", padding: "4px", borderRadius: "10px",
        border: "1px solid var(--border)", width: "fit-content",
        animation: "fadeUp .4s .1s ease both", opacity: 0, animationFillMode: "forwards",
      }}>
        {[["grade","Grade por semestre"],["lista","Por situação"]].map(([v, l]) => (
          <button key={v} onClick={() => setAba(v)} style={{
            padding: "6px 18px", borderRadius: "7px", fontSize: "13px",
            cursor: "pointer", border: "none", fontFamily: "var(--font)",
            background: aba === v ? "var(--purple-bg)" : "transparent",
            color: aba === v ? "var(--purple)" : "var(--muted)",
            fontWeight: aba === v ? 500 : 400,
            transition: "all .15s",
          }}>{l}</button>
        ))}
      </div>

      {/* Grade */}
      {aba === "grade" && (
        <div style={{
          display: "flex", gap: "10px", overflowX: "auto",
          paddingBottom: "12px",
          animation: "fadeUp .3s ease both",
        }}>
          {Object.entries(porSemestre).map(([sem, discs], si) => (
            <div key={sem} style={{
              minWidth: "172px", flexShrink: 0,
              borderRadius: "var(--radius)", overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              animation: `fadeUp .3s ${si * .04}s ease both`,
              opacity: 0, animationFillMode: "forwards",
            }}>
              <div style={{
                padding: "10px 12px", fontSize: "11px", fontWeight: 500,
                color: "var(--muted)", letterSpacing: ".06em",
                textTransform: "uppercase",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg3)",
              }}>
                {sem}º Semestre
              </div>
              <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
                {discs.map(d => {
                  const { selo, antiga, obs } = getSelo(d.nome);
                  const s = SELOS[selo];
                  const isHover = hover === d.nome;
                  return (
                    <div
                      key={d.nome}
                      onMouseEnter={() => setHover(d.nome)}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        padding: "8px 10px", borderRadius: "var(--radius-sm)",
                        background: isHover ? s.bg : "transparent",
                        border: `1px solid ${isHover ? s.cor : "var(--border)"}`,
                        transition: "all .15s", cursor: "default",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <span style={{
                          fontSize: "11px", color: s.cor, flexShrink: 0,
                          marginTop: "1px", fontFamily: "var(--mono)",
                        }}>{s.icone}</span>
                        <span style={{ fontSize: "11px", fontWeight: 500, lineHeight: "1.35", color: "var(--text)" }}>
                          {d.nome}
                        </span>
                      </div>
                      {antiga && (
                        <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "3px", paddingLeft: "17px" }}>
                          ← {antiga}
                        </div>
                      )}
                      {obs && (
                        <div style={{ fontSize: "10px", color: "var(--amber)", marginTop: "3px", paddingLeft: "17px" }}>
                          ⚠ {obs}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista por situação */}
      {aba === "lista" && (
        <div style={{
          display: "flex", flexDirection: "column", gap: "24px",
          animation: "fadeUp .3s ease both",
        }}>
          {[
            { titulo: "Concluídas por equivalência", selo: "concluida_equivalencia",
              items: resultado.obrigatorias.filter(d => d.selo === "concluida_equivalencia").map(d => d.disciplinaNova) },
            { titulo: "Optativas aproveitadas", selo: "optativa_aproveitada",
              items: resultado.optativas },
            { titulo: "Liberadas para matrícula", selo: "liberada",
              items: resultado.prereqsLiberados },
            { titulo: "Bloqueadas", selo: "bloqueada",
              items: resultado.bloqueadas.map(d => d.disciplinaAntiga) },
          ].map(grupo => {
            const s = SELOS[grupo.selo];
            return (
              <div key={grupo.titulo}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ color: s.cor, fontFamily: "var(--mono)" }}>{s.icone}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--muted)",
                    textTransform: "uppercase", letterSpacing: ".06em" }}>
                    {grupo.titulo}
                  </span>
                  <span style={{
                    fontSize: "11px", padding: "1px 7px", borderRadius: "99px",
                    background: s.bg, color: s.cor, border: `1px solid ${s.cor}`,
                    fontFamily: "var(--mono)",
                  }}>{grupo.items.length}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {grupo.items.map((item, i) => (
                    grupo.selo === "optativa_aproveitada"
                      ? <ChipOptativa key={i} item={item} s={s} />
                      : <div key={i} style={{
                          padding: "5px 12px", borderRadius: "99px", fontSize: "12px",
                          background: s.bg, color: s.cor, border: `1px solid ${s.cor}`,
                        }}>
                          {typeof item === "string" ? item : (item.disciplinaNova || item.disciplinaAntiga)}
                        </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legenda */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "12px",
        marginTop: "32px", paddingTop: "20px",
        borderTop: "1px solid var(--border)",
      }}>
        {Object.entries(SELOS).filter(([k]) => k !== "pendente").map(([k, s]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--muted)" }}>
            <span style={{ color: s.cor, fontFamily: "var(--mono)" }}>{s.icone}</span>
            {s.label}
          </div>
        ))}
      </div>

    </div>
  );
}