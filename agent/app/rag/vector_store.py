import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from .loader import load_documents  # Your document loader function
from pathlib import Path

# Path where the vectorstore is saved/loaded from
VECTORSTORE_PATH = "./chroma_db"
COLLECTION_NAME = "example_collection"

# Shared embedding function
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", chunk_size=1)


def build_vectorstore_from_file(txt_file_path: str) -> Chroma:
    """
    Loads the vectorstore from disk (if exists), appends new docs, and saves it back.
    Useful for building a persistent and growing knowledge base.
    """
    documents = load_documents(txt_file_path)

    # Initialize vector store with persistence directory
    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=VECTORSTORE_PATH,
    )

    # Add new documents
    vector_store.add_documents(documents)

    return vector_store


def load_vectorstore() -> Chroma:
    """
    Load the persisted vector store from disk.
    """
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=VECTORSTORE_PATH,
    )
