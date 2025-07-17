from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from pathlib import Path


def build_loader(path: str):
    """
    Function to create a document loader based on file type.
    Supports .txt and .pdf files.
    Args:
        path (str): The file path to load.
    Returns:
        DocumentLoader: An instance of a document loader for the specified file type.
    """
    suffix = Path(path).suffix.lower()
    if suffix == ".txt":
        return TextLoader(path, encoding="utf-8")
    elif suffix == ".pdf":
        return PyPDFLoader(path)
    else:
        raise ValueError(f"Unsupported file type: {suffix}")


def load_documents(path: str) -> list[Document]:
    """
    Loads documents, annotates each document's metadata with the source file name,
    and splits the documents into smaller chunks using a recursive character text splitter.
    Args:
        path (str): The file path from which to load the documents.
    Returns:
        list[Document]: A list of split Document objects.
    """
    loader = build_loader(path)
    docs = loader.load()

    for doc in docs:
        doc.metadata["source_file"] = Path(path).name

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True
        )
    split_docs = splitter.split_documents(docs)
    return split_docs
