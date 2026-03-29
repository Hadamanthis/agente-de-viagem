from ddgs import DDGS
import requests
from bs4 import BeautifulSoup
from requests import RequestException
import logging

class WebSearch:
    def __init__(self, fetch_pages = 1):
        self.logger = logging.getLogger(__name__)
        self.fetch_pages = fetch_pages

    def search(self, prompt, max_results=3):
        """ Retorna a busca na web com contexto relevante a partir do prompt"""

        self.logger.info("Requisição para busca online realizada")

        try:
            with DDGS() as ddgs:
                results = ddgs.text(prompt, max_results=max_results, region="br-pt")
                if not results:
                    results = ddgs.text(prompt, max_results=max_results)
        except Exception as e:
            self.logger.error(f"Erro ao tentar chamar o ddgs:\n {e}.")
            return [f"Erro ao tentar obter informações online."]

        self.logger.info(f"Chamada ao ddgs para obter snippets feito com sucesso.")

        for i, result in enumerate(results[:self.fetch_pages]):
            result['body'] = self._fetch_page_content(result['href'])

        return results


    def _fetch_page_content(self, url):
        try:
            response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
        except RequestException as e:
            self.logger.error(f"Erro ao tentar fazer o fetch a {url}.")
            return f"Erro ao acessar a página: {url}"

        self.logger.info(f"Fetch a {url} feito com sucesso.")

        soup = BeautifulSoup(response.text, "html.parser")

        # Removendo tags de estilo e scripts
        for tag in soup(["script", "style"]):
            tag.decompose()

        return soup.get_text(separator=" ", strip=True)[:3000]