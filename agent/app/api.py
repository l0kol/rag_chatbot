from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from app.rag.qa_chain import get_qa_chain
from pathlib import Path
from app.rag.vector_store import build_vectorstore_from_file
import shutil

BASE_DIR = Path(__file__).resolve().parents[1]
filepath = BASE_DIR / "data" / "books" / "CountOfMonteChristo.txt"

qa = None
upload_dir = BASE_DIR / "temp_uploads"


def load_qa():
    global qa
    try:
        qa = get_qa_chain()
    except FileNotFoundError:
        qa = None  # Or a fallback that says "no data yet"


load_qa()

router = APIRouter()


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask(req: AskRequest):
    if qa is None:
        return {"answer": "No data available. Please upload a document first."}
    result = qa.invoke({"input": req.question})
    return {"answer": result["answer"]}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename

    with open(file_path, "wb") as out_file:
        shutil.copyfileobj(file.file, out_file)

    # Rebuild vectorstore
    build_vectorstore_from_file(str(file_path))

    load_qa()

    return {"message": f"{file.filename} processed and added to vector store."}
