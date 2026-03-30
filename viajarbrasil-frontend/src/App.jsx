import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const DESTINATIONS = [
  {
    name: "Fernando de Noronha",
    state: "Pernambuco",
    description: "Paraíso ecológico com praias de águas cristalinas e fauna marinha única.",
    emoji: "🐠",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    name: "Chapada Diamantina",
    state: "Bahia",
    description: "Cachoeiras, grutas e trilhas em meio à Caatinga e Mata Atlântica.",
    emoji: "🏔️",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    name: "Lençóis Maranhenses",
    state: "Maranhão",
    description: "Dunas brancas e lagoas azuis num cenário de outro planeta.",
    emoji: "🌊",
    gradient: "from-sky-300 to-indigo-500",
  },
  {
    name: "Pantanal",
    state: "Mato Grosso",
    description: "A maior planície alagável do mundo, berço da biodiversidade.",
    emoji: "🦜",
    gradient: "from-amber-400 to-orange-600",
  },
  {
    name: "Bonito",
    state: "Mato Grosso do Sul",
    description: "Mergulho em rios de água transparente entre peixes coloridos.",
    emoji: "🤿",
    gradient: "from-blue-400 to-cyan-600",
  },
  {
    name: "Jericoacoara",
    state: "Ceará",
    description: "Vila de pescadores transformada em destino de vento, kite e pôr do sol.",
    emoji: "🌅",
    gradient: "from-orange-300 to-rose-500",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Conte seu sonho",
    description: "Diga ao Marvin para onde quer ir, quando, com quem e qual é o seu orçamento.",
  },
  {
    step: "02",
    title: "Marvin pesquisa",
    description: "Nosso agente consulta nossa base de destinos e busca informações atualizadas na web.",
  },
  {
    step: "03",
    title: "Pacote personalizado",
    description: "Receba sugestões de pacotes, preços e dicas exclusivas sob medida para você.",
  },
];

function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o Marvin, seu agente de viagens pessoal. Para onde você sonha em ir? ✈️",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const historyForAPI = newMessages.slice(1).slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: userMessage,
          messages: historyForAPI,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ops! Não consegui me conectar ao servidor. Verifique se a API está rodando.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 15, 40, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#f8faff",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: "560px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(3, 50, 120, 0.35)",
          animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0a2463, #1e5fa8)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem" }}>
              Marvin
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif" }}>
              Agente ViajarBrasil • online
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            background: "#f0f5ff",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "0.75rem 1rem",
                  borderRadius: msg.role === "user" ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
                  background: msg.role === "user" ? "linear-gradient(135deg, #0a2463, #1e5fa8)" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#1a2a4a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  boxShadow: "0 2px 8px rgba(10,36,99,0.1)",
                  whiteSpace: "pre-wrap",
                }}
              >
                  <div className="chat-markdown">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(10,36,99,0.1)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#1e5fa8",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "1rem 1.25rem",
            background: "#fff",
            borderTop: "1px solid #e2eaf8",
            display: "flex",
            gap: "0.625rem",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Para onde você quer ir?"
            style={{
              flex: 1,
              border: "1.5px solid #d0ddf5",
              borderRadius: "2rem",
              padding: "0.625rem 1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
              color: "#1a2a4a",
              background: "#f5f8ff",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "#cdd8f0" : "linear-gradient(135deg, #0a2463, #1e5fa8)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 42,
              height: 42,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #030f28;
          color: #1a2a4a;
          overflow-x: hidden;
        }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0) }
          40% { transform: translateY(-6px) }
        }
        @keyframes shimmer {
          0% { background-position: -200% center }
          100% { background-position: 200% center }
        }
        @keyframes waveMove {
          0% { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }

        .hero-btn {
          background: linear-gradient(135deg, #1e8ef0, #0a2463);
          color: #fff;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 3rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 32px rgba(30,142,240,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .hero-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(30,142,240,0.55);
        }

        .dest-card {
          background: #fff;
          border-radius: 1.25rem;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(10,36,99,0.18);
        }

        .nav-link {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }

        .fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: linear-gradient(135deg, #1e8ef0, #0a2463);
          color: #fff;
          border: none;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(30,142,240,0.5);
          z-index: 500;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
        }
        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(30,142,240,0.65);
          animation: none;
        }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(3,15,40,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "all 0.3s",
        }}
      >
        <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Viajar<span style={{ color: "#4aade8" }}>Brasil</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#destinos" className="nav-link">Destinos</a>
          <a href="#como-funciona" className="nav-link">Como Funciona</a>
          <button
            className="hero-btn"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
            onClick={() => setChatOpen(true)}
          >
            Falar com Marvin
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          background: "linear-gradient(165deg, #030f28 0%, #0a2463 50%, #0d3a7a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,142,240,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,173,232,0.1), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(30,142,240,0.15)",
              border: "1px solid rgba(74,173,232,0.3)",
              borderRadius: "2rem",
              padding: "0.375rem 1rem",
              color: "#4aade8",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            ✦ Agente de Viagens com IA
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            O Brasil te espera.{" "}
            <span
              style={{
                fontStyle: "italic",
                background: "linear-gradient(90deg, #4aade8, #1e8ef0, #7dd4fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Marvin
            </span>{" "}
            te leva.
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.15rem",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: 520,
              margin: "0 auto 2.5rem",
              fontWeight: 300,
            }}
          >
            Descreva o seu sonho de viagem e nosso agente inteligente monta o pacote perfeito — com destinos, preços e dicas exclusivas.
          </p>

          <button className="hero-btn" onClick={() => setChatOpen(true)}>
            Conversar com Marvin ✈️
          </button>
        </div>

        {/* Wave bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, overflow: "hidden" }}>
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" fill="#f0f5ff" />
          </svg>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        style={{
          background: "#f0f5ff",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: "#1e8ef0", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Como Funciona
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0a2463",
                letterSpacing: "-0.02em",
              }}
            >
              Simples como sonhar
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(10,36,99,0.07)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: "rgba(30,142,240,0.08)",
                    position: "absolute",
                    top: "0.5rem",
                    right: "1rem",
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.75rem",
                    background: "linear-gradient(135deg, #1e8ef0, #0a2463)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#0a2463",
                    marginBottom: "0.625rem",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "#5a7099", lineHeight: 1.6, fontSize: "0.95rem" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINOS */}
      <section
        id="destinos"
        style={{
          background: "#fff",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: "#1e8ef0", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Destinos em Destaque
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0a2463",
                letterSpacing: "-0.02em",
              }}
            >
              Brasil de ponta a ponta
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {DESTINATIONS.map((dest, i) => (
              <div key={i} className="dest-card" style={{ boxShadow: "0 4px 16px rgba(10,36,99,0.08)" }}>
                <div
                  style={{
                    height: 160,
                    background: `linear-gradient(135deg, var(--from), var(--to))`,
                    backgroundImage: `linear-gradient(135deg, ${dest.gradient.replace("from-", "").replace("to-", "")})`,
                    background: `linear-gradient(135deg, ${
                      dest.gradient.includes("cyan") ? "#22d3ee, #2563eb" :
                      dest.gradient.includes("emerald") ? "#34d399, #0d9488" :
                      dest.gradient.includes("sky") ? "#7dd3fc, #6366f1" :
                      dest.gradient.includes("amber") ? "#fbbf24, #ea580c" :
                      dest.gradient.includes("blue-4") ? "#60a5fa, #0891b2" :
                      "#fb923c, #f43f5e"
                    })`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.08)" }} />
                  <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                    {dest.emoji}
                  </span>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#0a2463" }}>
                      {dest.name}
                    </h3>
                    <span style={{ color: "#8aa3cc", fontSize: "0.8rem" }}>{dest.state}</span>
                  </div>
                  <p style={{ color: "#5a7099", fontSize: "0.9rem", lineHeight: 1.5 }}>{dest.description}</p>
                  <button
                    onClick={() => setChatOpen(true)}
                    style={{
                      marginTop: "1rem",
                      background: "none",
                      border: "1.5px solid #d0ddf5",
                      borderRadius: "2rem",
                      padding: "0.4rem 1rem",
                      color: "#1e5fa8",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "#0a2463"; e.target.style.color = "#fff"; e.target.style.borderColor = "#0a2463"; }}
                    onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "#1e5fa8"; e.target.style.borderColor = "#d0ddf5"; }}
                  >
                    Perguntar ao Marvin →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#030f28",
          color: "rgba(255,255,255,0.5)",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              fontSize: "1.6rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Viajar<span style={{ color: "#4aade8" }}>Brasil</span>
          </div>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Seu agente inteligente de viagens pelo Brasil.<br />
            contato@viajarbrasil.com.br • (85) 99999-9999
          </p>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "2rem" }}>
            {["Instagram", "WhatsApp", "Facebook"].map((r) => (
              <a key={r} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "#4aade8"}
                onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
              >
                {r}
              </a>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", fontSize: "0.75rem" }}>
            © 2025 ViajarBrasil. Feito com ❤️ e IA.
          </div>
        </div>
      </footer>

      {/* FAB */}
      {!chatOpen && (
        <button className="fab" onClick={() => setChatOpen(true)} title="Falar com Marvin">
          ✈️
        </button>
      )}

      {/* CHAT MODAL */}
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
