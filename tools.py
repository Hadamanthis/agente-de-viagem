tools = [
    {
        "type": "function",
        "function": {
            "name": "knowledge_base_search",
            "description": "Está é sua fonte de informação primaria para preços e pacotes. Busca informações sobre pacotes, destinos, preços e políticas da ViajarBrasil na base de dados interna da agência. Se ela não retornar uma quantidade suficiente de informação, consulte na web_search",
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
            "description": "Sempre consulte quando a knowledge_base_search não retornar informações suficientes para responder ao cliente. Use para buscar informações atualizadas que não estão na base de dados interna da agência, como preços de passagens aéreas, hotéis avulsos, clima atual, eventos, atrações e dicas de viagem.",
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