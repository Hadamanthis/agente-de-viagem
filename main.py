from llm_client import LLMClient
from knowledge_base import KnowledgeBase
from web_search import WebSearch
from tools import tools
from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import config
import logging

app = FastAPI()

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

    logger.info("Requisição ao POST '/chat'.")

    response, updated_messages = llm.call(request.user_message, request.messages)

    logger.info("Requisição ao POST '/chat' concluída com sucesso")

    return {"response": response, "messages": updated_messages}