from duckduckgo_search import DDGS

class WebSearch:

    @staticmethod
    def search(prompt, max_results=3):
        """ Retorna a busca na web com contexto relevante a partir do prompt"""

        with DDGS() as ddgs:
            return ddgs.text(prompt, max_results=max_results)