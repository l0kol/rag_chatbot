from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from .vector_store import load_vectorstore


def get_qa_chain():
    vectorstore = load_vectorstore()

    llm = ChatOpenAI(model="gpt-4o-mini")

    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

    combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)
    qa_chain = create_retrieval_chain(
        vectorstore.as_retriever(),
        combine_docs_chain,
    )

    return qa_chain
