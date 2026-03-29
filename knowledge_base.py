import chromadb
from pathlib import Path
import logging

class KnowledgeBase:
    def __init__(self, knowledge_base_path, vector_store_path="./vector_store"):
        self.knowledge_base_path = knowledge_base_path
        self.client = chromadb.PersistentClient(path=vector_store_path)
        self.collection = self.client.get_or_create_collection(name="agente-de-viagens")
        self.logger = logging.getLogger(__name__)

    def index(self):
        """ Responsável por indexar a base de conhecimento em um vector database."""

        self.logger.info("Requisição para indexação da knowledge base")

        knowledge_dir = Path(self.knowledge_base_path)

        # Para cada arquivo
        for file in knowledge_dir.glob("*.txt"):
            with open(file, "r", encoding="utf-8") as f:

                # Salva cada sentença individualmente
                file_content = f.read()
                for index, sentence in enumerate(file_content.split("\n\n")):
                    sentence_id = file.stem + '_' + str(index)

                    self.collection.upsert(
                        ids=[sentence_id],
                        documents=[sentence]
                    )

        self.logger.info("Indexação da knowledge base concluída com sucesso.")

    def search(self, prompt_history, n_results=1):
        """ Responsável por buscar os contextos baseados nos inputs do usuário. """

        self.logger.info("Requisição para busca na knowledge base realizada")

        query_results = self.collection.query(query_texts=list(prompt_history), n_results=n_results)

        # Pegando somente as sentenças
        query_results = query_results.get('documents')

        # Transformando a lista de listas em uma lista flat
        contexts_flat = [context for sublist in query_results for context in sublist]

        # Removendo contextos duplicados
        result = list(set(contexts_flat))

        return result