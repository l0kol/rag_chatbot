from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from .vector_store import VectorStoreManager

def get_user_retriever(user_id: str):
    vs_manager = VectorStoreManager(user_id)
    return vs_manager.load_vectorstore().as_retriever()

def get_qa_chain(user_id: str):
    print(f"Creating QA chain for user: {user_id}")
    retriever = get_user_retriever(user_id)

    llm = ChatOpenAI(model="gpt-4o-mini")

    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

    combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)

    return create_retrieval_chain(retriever,combine_docs_chain)
