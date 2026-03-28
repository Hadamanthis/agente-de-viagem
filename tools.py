tools = [
    {
        "type": "function",
        "function": {
            "name": "knowledge_base_search",
            "description": "SEMPRE use esta ferramenta antes de responder qualquer pergunta sobre pacotes, destinos, preços, políticas ou serviços da ViajarBrasil. Busca informações na base de dados interna da agência.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Termo de busca relacionado à pergunta do usuário"
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Use para buscar informações atualizadas sobre destinos turísticos como clima atual, eventos, atrações e dicas de viagem que podem não estar na base de dados interna.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Termo de busca"
                    }
                },
                "required": ["query"]
            }
        }
    }
]