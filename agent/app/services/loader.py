from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from pathlib import Path


def build_loader(path: str):
    """
    Factory function to create a document loader based on file type.
    Supports .txt and .pdf files.
    """
    suffix = Path(path).suffix.lower()
    if suffix == ".txt":
        return TextLoader(path, encoding="utf-8")
    elif suffix == ".pdf":
        return PyPDFLoader(path)
    else:
        raise ValueError(f"Unsupported file type: {suffix}")


def load_documents(path: str) -> list[Document]:
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
