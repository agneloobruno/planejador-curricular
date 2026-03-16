import { useState, useRef } from "react";
import { parsearHistorico } from "./engine/parsearHistorico";
import { classificar } from "./engine/classificar";
import GradeCurricular from "./components/GradeCurricular";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function App() {
  const [resultado, setResultado]     = useState(null);
  const [carregando, setCarregando]   = useState(false);
  const [erro, setErro]               = useState(null);
  const [arrastando, setArrastando]   = useState(false);
  const inputRef = useRef();

  async function handleArquivo(file) {
    if (!file || file.type !== "application/pdf") {
      setErro("Só PDFs são aceitos."); return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      setErro("PDF muito grande. Limite de 10 MB."); return;
    }
    setCarregando(true); setErro(null);
    try {
      const historico = await parsearHistorico(file);
      setResultado(classificar(historico));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao ler o PDF. Tente novamente.";
      setErro(msg);
      if (import.meta.env.DEV) console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  function onDrop(e) {
    e.preventDefault(); setArrastando(false);
    handleArquivo(e.dataTransfer.files[0]);
  }

  if (resultado) return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <GradeCurricular resultado={resultado} onReset={() => setResultado(null)} />
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "32px 16px",
    }}>
      {/* Logo / título */}
      <div style={{ textAlign: "center", marginBottom: "48px", animation: "fadeUp .5s ease both" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "56px", height: "56px", borderRadius: "16px",
          background: "var(--purple-bg)", border: "1px solid var(--purple)",
          fontSize: "24px", marginBottom: "16px",
        }}>🎓</div>
        <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-.5px" }}>
          Planejador Curricular
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>
          UFMT · Sistemas de Informação · PPC 2026
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setArrastando(true); }}
        onDragLeave={() => setArrastando(false)}
        onDrop={onDrop}
        style={{
          width: "100%", maxWidth: "480px",
          padding: "48px 32px", borderRadius: "20px",
          border: `1.5px dashed ${arrastando ? "var(--purple)" : "var(--border2)"}`,
          background: arrastando ? "var(--purple-bg)" : "var(--bg2)",
          cursor: "pointer", textAlign: "center",
          transition: "all .2s ease",
          animation: "fadeUp .5s .1s ease both", opacity: 0,
          animationFillMode: "forwards",
          boxShadow: arrastando ? "0 0 0 4px var(--purple-bg)" : "none",
        }}
      >
        {carregando ? (
          <div>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "2px solid var(--border2)",
              borderTopColor: "var(--purple)",
              animation: "spin .8s linear infinite",
              margin: "0 auto 16px",
            }}/>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Lendo histórico...</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "36px", marginBottom: "16px", lineHeight: 1 }}>📄</div>
            <p style={{ fontWeight: 500, marginBottom: "6px" }}>
              Arraste seu histórico aqui
            </p>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "20px" }}>
              ou clique para selecionar
            </p>
            <div style={{
              display: "inline-block", padding: "8px 20px",
              borderRadius: "99px", fontSize: "13px", fontWeight: 500,
              background: "var(--purple-bg)", color: "var(--purple)",
              border: "1px solid var(--purple)",
            }}>
              Selecionar PDF
            </div>
          </>
        )}
        <input
          ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
          onChange={e => handleArquivo(e.target.files[0])}
        />
      </div>

      {erro && (
        <p style={{
          marginTop: "16px", color: "var(--red)", fontSize: "13px",
          background: "var(--red-bg)", padding: "8px 16px",
          borderRadius: "8px", border: "1px solid var(--red)",
        }}>{erro}</p>
      )}

      <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "24px" }}>
        Seu PDF não é enviado para nenhum servidor — tudo roda no seu navegador.
      </p>
    </div>
  );
}