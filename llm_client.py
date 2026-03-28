from dotenv import load_dotenv
from openai import OpenAI
import os
import json

class LLMClient:
    def __init__(self, system_prompt, tools, knowledge_base_client, web_search_client):
        self.system_prompt = system_prompt

        load_dotenv()

        # Injeção de dependências
        self.knowledge_base = knowledge_base_client
        self.web_search = web_search_client

        self.tools = tools
        self.client = OpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )

    def call(self, user_prompt, messages):
        """ Se comunica com a LLM a partir da última mensagem do usuário e do histórico de mensagens """

        messages = list(messages)

        messages.append({"role": "user", "content": user_prompt})

        full_response = [
            {"role": "system", "content": self.system_prompt},
            *messages
        ]

        response_raw = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=full_response,
            tools=self.tools,
            tool_choice={
                "type": "function",
                "function": {"name": "knowledge_base_search"}
            }
        )

        response = response_raw.choices[0].message.content
        print(f"DEBUG - response: {response}")
        print(f"DEBUG - tool_calls: {response_raw.choices[0].message.tool_calls}")

        # Se response é None, então a LLM enviou tools (function calling)
        if response is None:

            # Adiciona ao histórico que o modelo pediu a necessidade de chamar alguma função
            messages.append({
                "role": "assistant",
                "content": None,
                "tool_calls": response_raw.choices[0].message.tool_calls
            })

            for tool in response_raw.choices[0].message.tool_calls:
                llm_query = json.loads(tool.function.arguments)['query']

                # Verificando se precisa chamar o vector database
                if tool.function.name == "knowledge_base_search":
                    kb_context = self.knowledge_base.search(llm_query, n_results=2)

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool.id,
                        "content": str(kb_context)
                    })

                # Verificando se precisa realizar uma busca na web
                if tool.function.name == "web_search":
                    ws_context = self.web_search.search(llm_query, max_results=3)

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool.id,
                        "content": str(ws_context)
                    })

            full_response = [
                {"role": "system", "content": self.system_prompt},
                *messages
            ]

            # Chamando a LLM com o novo contexto
            response_raw = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=full_response
            )

            response = response_raw.choices[0].message.content

        messages.append({"role": "assistant", "content": response})

        return response, messages





