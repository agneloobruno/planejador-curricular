import { useState, useRef } from "react";
import { parsearHistorico } from "./engine/parsearHistorico";
import { classificar } from "./engine/classificar";
import GradeCurricular from "./components/GradeCurricular";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function serializarErro(erro, nivel = 0) {
  if (nivel > 2 || !erro) return null;

  if (erro instanceof Error) {
    return {
      name: erro.name,
      message: erro.message,
      code: erro.code ?? null,
      stack: erro.stack ?? null,
      cause: serializarErro(erro.cause, nivel + 1),
    };
  }

  if (typeof erro === "object") {
    try {
      return JSON.parse(JSON.stringify(erro));
    } catch {
      return { toString: String(erro) };
    }
  }

  return { value: String(erro) };
}

function criarDebugPayload(erro, file) {
  const nav = typeof navigator !== "undefined" ? navigator : null;

  return {
    timestamp: new Date().toISOString(),
    file: file
      ? {
          name: file.name ?? null,
          size: file.size ?? null,
          type: file.type ?? null,
          lastModified: file.lastModified ?? null,
        }
      : null,
    device: nav
      ? {
          userAgent: nav.userAgent,
          platform: nav.platform,
          language: nav.language,
          onLine: nav.onLine,
        }
      : null,
    error: serializarErro(erro),
  };
}

function temExtensaoPdf(file) {
  return typeof file?.name === "string" && file.name.toLowerCase().endsWith(".pdf");
}

function parecePdf(file) {
  if (!file) return false;
  return file.type === "application/pdf" || (file.type === "" && temExtensaoPdf(file));
}

export default function App() {
  const [resultado, setResultado]     = useState(null);
  const [carregando, setCarregando]   = useState(false);
  const [erro, setErro]               = useState(null);
  const [debugPayload, setDebugPayload] = useState(null);
  const [debugAberto, setDebugAberto] = useState(false);
  const [arrastando, setArrastando]   = useState(false);
  const inputRef = useRef();

  async function handleArquivo(file) {
    if (!file || !parecePdf(file)) {
      setErro("Só PDFs são aceitos."); return;
    }
    if (file.size === 0) {
      setErro("O arquivo parece indisponível no dispositivo. Abra o PDF no app de arquivos e tente compartilhar/copiar localmente antes do upload."); return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      setErro("PDF muito grande. Limite de 10 MB."); return;
    }
    setCarregando(true); setErro(null);
    setDebugPayload(null);
    setDebugAberto(false);
    try {
      const historico = await parsearHistorico(file);
      setResultado(classificar(historico));
    } catch (e) {
      setDebugPayload(criarDebugPayload(e, file));
      setDebugAberto(true);
      const msg = e instanceof Error
        ? e.message
        : "Erro ao ler o PDF. Em celular, tente salvar o arquivo localmente e reenviar.";
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
        <div style={{ width: "100%", maxWidth: "480px", marginTop: "16px" }}>
          <p style={{
            color: "var(--red)", fontSize: "13px",
            background: "var(--red-bg)", padding: "8px 16px",
            borderRadius: "8px", border: "1px solid var(--red)",
            marginBottom: "10px",
          }}>{erro}</p>

          {debugPayload && (
            <div style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: "10px",
              overflow: "hidden",
            }}>
              <button
                type="button"
                onClick={() => setDebugAberto(v => !v)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {debugAberto ? "Ocultar" : "Mostrar"} detalhes técnicos do erro
              </button>

              {debugAberto && (
                <div style={{ padding: "0 12px 12px" }}>
                  <pre style={{
                    margin: 0,
                    fontSize: "11px",
                    lineHeight: 1.35,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "#d7dcef",
                    background: "#0b1021",
                    border: "1px solid var(--border2)",
                    borderRadius: "8px",
                    padding: "10px",
                    maxHeight: "240px",
                    overflow: "auto",
                  }}>
                    {JSON.stringify(debugPayload, null, 2)}
                  </pre>
                  <button
                    type="button"
                    onClick={async () => {
                      const texto = JSON.stringify(debugPayload, null, 2);
                      if (navigator?.clipboard?.writeText) {
                        await navigator.clipboard.writeText(texto);
                      }
                    }}
                    style={{
                      marginTop: "8px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border2)",
                      background: "transparent",
                      color: "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    Copiar diagnóstico
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "24px" }}>
        Seu PDF não é enviado para nenhum servidor — tudo roda no seu navegador.
      </p>
    </div>
  );
}