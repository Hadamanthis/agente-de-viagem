import openai
from dotenv import load_dotenv
from openai import OpenAI
import os
import json
import config
import logging

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

        self.logger = logging.getLogger(__name__)

    def call(self, user_prompt, messages):
        messages = list(messages)
        messages.append({"role": "user", "content": user_prompt})

        full_messages = [
            {"role": "system", "content": self.system_prompt},
            *messages
        ]

        # Primeira chamada, a LLM decide se quer chamar alguma função
        try:
            response_raw = self.client.chat.completions.create(
                model=config.MODEL,
                messages=full_messages,
                tools=self.tools,
                tool_choice="auto"
            )

            self.logger.info("Comunicação com LLM feita com sucesso")

            while True:
                response = response_raw.choices[0].message.content

                # Modelo respondeu diretamente — fim do loop
                if response is not None:
                    break

                self.logger.info("LLM requisita mais informações.")
                self.logger.info(f"Tool chamada: {tool.function.name} | Query: {llm_query}")

                # Adiciona decisão do modelo ao histórico
                messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": response_raw.choices[0].message.tool_calls
                })

                # Executa cada tool chamada pelo modelo
                for tool in response_raw.choices[0].message.tool_calls:
                    llm_query = json.loads(tool.function.arguments)['query']

                    if tool.function.name == "knowledge_base_search":
                        context = self.knowledge_base.search(llm_query, n_results=config.KB_N_RESULTS)
                    elif tool.function.name == "web_search":
                        context = self.web_search.search(llm_query, max_results=config.WEB_MAX_RESULTS)

                    # Adiciona resultado da tool ao histórico
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool.id,
                        "name": tool.function.name,
                        "content": str(context)
                    })

                # Reconstrói full_messages uma vez antes da próxima chamada
                full_messages = [{"role": "system", "content": self.system_prompt}, *messages]

                # Próximas chamadas — modelo decide livremente
                response_raw = self.client.chat.completions.create(
                    model=config.MODEL,
                    messages=full_messages,
                    tools=self.tools,
                    tool_choice="auto"
                )

        except openai.APIError:
            return "O Marvin está indisponível no momento, por favor, tente mais tarde", messages

        self.logger.info("Chamada a LLM feita com sucesso.")

        messages.append({"role": "assistant", "content": response})
        return response, messages