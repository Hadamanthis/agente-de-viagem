from llm_client import LLMClient
from knowledge_base import KnowledgeBase
from web_search import WebSearch
from tools import tools
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import config
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregando comportamento base da LLM
system_prompt = Path("./system_prompt.txt").read_text(encoding="utf-8")

# Instanciando dependências a serem injetadas na llm_client
kb_client = KnowledgeBase("./data")
ws_client = WebSearch(config.WEB_FETCH_PAGES)

# Indexando knowledge base
kb_client.index()

# Instanciando a LLM
llm = LLMClient(system_prompt, tools, kb_client, ws_client)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger(__name__)

# Definição da resposta do endpoint chat
class ChatRequest(BaseModel):
    messages: list # Histórico de mensagens
    user_message: str # Mensagem atual

@app.get("/")
def health_check():
    logger.info("GET ao '/' feito com sucesso.")
    logger.info("Requisição ao GET '/' concluída com sucesso")
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):
    """ Comunicação Stateless com a LLM """

    print("CHEGOU REQUISIÇÃO", request.user_message)

    logger.info("Requisição ao POST '/chat'.")

    response, updated_messages = llm.call(request.user_message, request.messages)

    logger.info("Requisição ao POST '/chat' concluída com sucesso")

    return {"response": response, "messages": updated_messages}