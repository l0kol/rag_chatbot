from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from .vector_store import VectorStoreManager

def get_user_retriever(user_id: str):
    vs_manager = VectorStoreManager(user_id)
    return vs_manager.load_vectorstore().as_retriever()

def get_qa_chain(user_id: str):
    """
    Creates and returns a retrieval-based QA (Question Answering) chain.
    This function initializes a retriever for the given user, sets up a language model (LLM),
    loads a retrieval QA chat prompt from the LangChain hub, and combines these components
    into a retrieval QA chain that can be used to answer questions based on user-specific data.
    Args:
        user_id (str): The unique identifier of the user for whom the QA chain is being created.
    Returns:
        RetrievalChain: A configured retrieval QA chain instance for the specified user.
    """
    print(f"Creating QA chain for user: {user_id}")
    retriever = get_user_retriever(user_id)

    llm = ChatOpenAI(model="gpt-4o-mini")

    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

    combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)

    return create_retrieval_chain(retriever,combine_docs_chain)
