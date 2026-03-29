from ddgs import DDGS
import requests
from bs4 import BeautifulSoup

class WebSearch:
    def __init__(self, fetch_pages = 1):
        self.fetch_pages = fetch_pages

    def search(self, prompt, max_results=3):
        """ Retorna a busca na web com contexto relevante a partir do prompt"""

        with DDGS() as ddgs:
            results = ddgs.text(prompt, max_results=max_results, region="br-pt")
            if not results:
                results = ddgs.text(prompt, max_results=max_results)

        for i, result in enumerate(results[:self.fetch_pages]):
            result['body'] = self._fetch_page_content(result['href'])

        return results

    @staticmethod
    def _fetch_page_content(url):
        response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]