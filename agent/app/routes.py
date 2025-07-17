from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from app.services.qa_chain import get_qa_chain
from .services.vector_store import VectorStoreManager
from pathlib import Path
import os
from typing import List
import shutil

# Base directory for file handling
BASE_DIR = Path(__file__).resolve().parents[1]
upload_dir = BASE_DIR / "temp_uploads"

# QA chain instance
# This will be initialized when the first request comes in
qa = None

# Router for the agent API
router = APIRouter()

class AskRequest(BaseModel):
    question: str
    user_id: str 

@router.post("/ask")
async def ask(req: AskRequest):
    """
    Endpoint to ask a question using the QA chain.
    It retrieves the QA chain for the user and invokes it with the question.
    """
    try:
        qa = get_qa_chain(user_id=req.user_id)
        result = qa.invoke({"input": req.question})
        return {"answer": result["answer"]}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}

@router.post("/upload")
async def upload_file(files: List[UploadFile] = File(...), user_id: str = Form(...)):
    """
    Endpoint to upload files and process them for the user.
    It saves the uploaded files to a temporary directory and builds the vector store.
    """
    os.makedirs(upload_dir, exist_ok=True)

    stored_files = []

    for file in files:
        file_path = upload_dir / file.filename

        with open(file_path, "wb") as out_file:
            shutil.copyfileobj(file.file, out_file)

        # Build and update vectorstore
        vector_store = VectorStoreManager(user_id=user_id)
        vector_store.build_vectorstore_from_file(str(file_path))

        stored_files.append(file.filename)

    return {"message": f"{file.filename} processed and added for user {user_id}."}

@router.get("/status")
async def status(user_id: str):
    return {"status": "Ready"}

@router.get("/user_docs")
async def user_docs(user_id: str):
    """
    Endpoint to fetch user documents from the vector store.
    It retrieves the source files associated with the user's vector store.
    As each document is broken into smaller chunks, this endpoint returns the unique source files
    associated with the user's vector store.
    """
    print(f"Fetching user docs for user_id: {user_id}")
    try:
        vsm = VectorStoreManager(user_id=user_id)
        docs = vsm.get_collection_source_files()
        return {"docs": docs}
    except Exception as e:
        return {"error": str(e)}
    
@router.delete("/delete_docs")
async def delete_docs(user_id: str):
    """
    Endpoint to delete the vector store for a user.
    """
    try:
        print(f"Deleting vector store for user_id: {user_id}")
        vsm = VectorStoreManager(user_id=user_id)
        vsm.delete_vectorstore()
        return {"message": "Vector store deleted successfully."}
    except Exception as e:
        return {"error": str(e)}