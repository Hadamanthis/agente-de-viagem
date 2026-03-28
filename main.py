from llm_client import LLMClient
from knowledge_base import KnowledgeBase
from web_search import WebSearch
from tools import tools
from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import json

app = FastAPI()
system_prompt = Path("./system_prompt.txt").read_text(encoding="utf-8")
kb_client = KnowledgeBase("./data")
kb_client.index()
ws_client = WebSearch()
llm = LLMClient(system_prompt, tools, kb_client, ws_client)

class ChatRequest(BaseModel):
    messages: list # Histórico de mensagens
    user_message: str # Mensagem atual

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):

    response, updated_messages = llm.call(request.user_message, request.messages)

    return {"response": response, "messages": updated_messages}