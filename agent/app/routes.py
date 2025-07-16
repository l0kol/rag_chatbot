from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from app.services.qa_chain import get_qa_chain
from .services.vector_store import VectorStoreManager
from pathlib import Path
import os
from typing import List

import shutil

BASE_DIR = Path(__file__).resolve().parents[1]

qa = None
upload_dir = BASE_DIR / "temp_uploads"

router = APIRouter()

class AskRequest(BaseModel):
    question: str
    user_id: str  # Expect user_id to be passed

@router.post("/ask")
async def ask(req: AskRequest):
    try:
        qa = get_qa_chain(user_id=req.user_id)
        result = qa.invoke({"input": req.question})
        return {"answer": result["answer"]}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}



@router.post("/upload")
async def upload_file(files: List[UploadFile] = File(...), user_id: str = Form(...)):
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
    print(f"Fetching user docs for user_id: {user_id}")
    try:
        vsm = VectorStoreManager(user_id=user_id)
        docs = vsm.get_collection_source_files()
        return {"docs": docs}
    except Exception as e:
        return {"error": str(e)}