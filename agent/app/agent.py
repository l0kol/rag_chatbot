from .rag.qa_chain import get_qa_chain
from .config import DOCUMENT_PATH

# Load the RetrievalQA chain on startup
qa_chain = get_qa_chain(DOCUMENT_PATH)
