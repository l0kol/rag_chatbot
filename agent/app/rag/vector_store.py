import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from .loader import load_documents
from pathlib import Path

# Path where the vectorstore is saved/loaded from
VECTORSTORE_PATH = "faiss_index"  # Folder, not a file

# Shared embedding function
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", chunk_size=1)


def build_vectorstore(path: str) -> FAISS:
    """Always builds a new vectorstore from scratch (used for isolated tasks)."""
    documents = load_documents(path)
    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(VECTORSTORE_PATH)
    return vectorstore


def build_vectorstore_from_file(txt_file_path: str) -> FAISS:
    """
    Loads the vectorstore from disk (if exists), appends new docs, and saves it back.
    Useful for building a persistent and growing knowledge base.
    """
    documents = load_documents(txt_file_path)

    if os.path.exists(os.path.join(VECTORSTORE_PATH, "index.faiss")):
        vectorstore = FAISS.load_local(
            VECTORSTORE_PATH,
            embeddings,
            allow_dangerous_deserialization=True,
        )
        vectorstore.add_documents(documents)
    else:
        vectorstore = FAISS.from_documents(documents, embeddings)

    vectorstore.save_local(VECTORSTORE_PATH)
    return vectorstore


def load_vectorstore():
    if (
        not (Path(VECTORSTORE_PATH) / "index.faiss").exists()
        or not (Path(VECTORSTORE_PATH) / "index.pkl").exists()
    ):
        raise FileNotFoundError(
            "FAISS index not found. Please upload a document to initialize the vector store."
        )
    embeddings = OpenAIEmbeddings()
    return FAISS.load_local(
        VECTORSTORE_PATH, embeddings, allow_dangerous_deserialization=True
    )
