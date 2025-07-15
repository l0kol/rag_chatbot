import os
from langchain_chroma import Chroma
import chromadb
from langchain_openai import OpenAIEmbeddings
from .loader import load_documents  # Your document loader function
from pathlib import Path


COLLECTION_NAME = "example_collection"

# Shared embedding function


class VectorStoreManager:
    def __init__(self, user_id: str, base_collection: str = "example_collection"):
        self.client = self._create_client()
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small", chunk_size=1
        )
        self.collection_name = f"{base_collection}_{user_id}"
        self.vector_store = self._create_vectorstore()

    def _create_client(self) -> chromadb.CloudClient:
        return chromadb.CloudClient(
            api_key=os.getenv("CHROMA_API_KEY"),
            tenant=os.getenv("CHROMA_TENANT_NAME"),
            database=os.getenv("CHROMA_DATABASE")
        )

    def _create_vectorstore(self) -> Chroma:
        return Chroma(
            client=self.client,
            collection_name=self.collection_name,
            embedding_function=self.embeddings,
        )

    def load_vectorstore(self) -> Chroma:
        return self.vector_store
    
    def get_collection_source_files(self) -> list:
        """
        Retrieve all unique 'source_file' strings from the vector store collection.
        """
        db_data = self.vector_store.get()
        metadatas = db_data.get("metadatas", [])
        source_files = set()
        for metadata in metadatas:
            source_file = metadata.get("source_file")
            if source_file:
                source_files.add(source_file)
        return list(source_files)

    def has_docs(self) -> int:
        """
        Get the number of documents in the vector store collection.
        Return true if there are documents, false otherwise.
        """  
        db_data = self.vector_store.get()
        ids = db_data.get("ids", [])
        return len(ids) > 0

    def build_vectorstore_from_file(self, txt_file_path: str) -> Chroma:
        try:
            documents = load_documents(txt_file_path)
            self.vector_store.add_documents(documents)
            return self.vector_store
        finally:
            try:
                file_path = Path(txt_file_path)
                if file_path.exists():
                    os.remove(file_path)
                    print(f"Deleted temporary file: {file_path}")
            except Exception as e:
                print(f"Error deleting file {txt_file_path}: {e}")
