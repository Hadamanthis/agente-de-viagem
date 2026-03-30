# ViajarBrasil — Agente de Viagens com IA

Agente de viagens inteligente especializado em destinos brasileiros. O Marvin, nosso assistente virtual, responde dúvidas sobre pacotes, preços e destinos consultando uma base de conhecimento interna e a web em tempo real.

---

## Stack

**Backend**
- Python + FastAPI + uvicorn
- LLM: Groq (`llama-3.3-70b-versatile`) via biblioteca `openai`
- Embeddings: ChromaDB com `sentence-transformers` (`all-MiniLM-L6-v2`)
- Busca web: `ddgs` (DuckDuckGo)
- Fetch de páginas: `requests` + `beautifulsoup4`

**Frontend**
- React + Vite
- `react-markdown` para renderização de respostas
- > ⚠️ O frontend foi gerado com auxílio de IA (Claude) e pode necessitar de refinamentos

---

## Como rodar

### Backend

```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
# Crie um arquivo .env com:
# GROQ_API_KEY=sua_chave_aqui

# Rodar a API
uvicorn main:app --reload
```

### Frontend

```bash
cd viajarbrasil-frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Arquitetura

```
agente-de-viagem/
├── data/
│   ├── pacotes.txt       ← pacotes e preços da agência
│   ├── destinos.txt      ← informações sobre destinos
│   └── politicas.txt     ← políticas da agência
├── vector_store/         ← embeddings ChromaDB (no .gitignore)
├── knowledge_base.py     ← indexação e busca vetorial
├── web_search.py         ← busca web + fetch de página
├── llm_client.py         ← agentic loop com function calling
├── tools.py              ← definição das tools no formato OpenAI
├── main.py               ← FastAPI endpoints
├── config.py             ← variáveis de configuração centralizadas
├── system_prompt.txt     ← personalidade e regras do Marvin
└── requirements.txt
```

---

## Problemas conhecidos e melhorias necessárias

### 🔴 Críticos

- **Alucinação do agente** — o Marvin ocasionalmente responde sem consultar as ferramentas, inventando pacotes e preços que não existem na base de dados. O `tool_choice` forçado para `knowledge_base_search` mitiga o problema mas não resolve completamente.

- **Encadeamento de tools inconsistente** — o modelo nem sempre consulta o `web_search` após a `knowledge_base_search` retornar resultados insuficientes, encerrando a resposta prematuramente.

### 🟡 Melhorias desejadas

- **Classificação de intenção** — implementar uma chamada prévia à LLM para classificar se a pergunta é sobre viagens antes de forçar o uso das tools, evitando consultas desnecessárias à knowledge base para perguntas fora do escopo.

- **Qualidade do frontend** — a interface foi gerada com auxílio de IA e pode ser refinada em termos de responsividade, acessibilidade e UX.

- **Formatação das respostas** — o Markdown renderizado no chat ainda apresenta inconsistências visuais em alguns casos.

### 🟢 Dívida técnica

- Type hints em todos os métodos
- Testes automatizados
- Variável `KB_N_RESULTS` ainda pode ser ajustada para melhorar relevância das buscas
- Logging poderia ser mais granular no frontend

---

## Créditos

Projeto desenvolvido como exercício de aprendizado de aplicações de IA.
Frontend gerado com auxílio do Claude (Anthropic).
