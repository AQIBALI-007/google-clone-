from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Backend is working"}


# ================= DOCUMENT ROUTES =================

# Create document
@app.post("/documents")
def create_document(document: dict, db: Session = Depends(get_db)):
    new_doc = models.Document(
        title=document.get("title"),
        content=document.get("content"),
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc


# Get all documents
@app.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    return db.query(models.Document).all()


# Update document
@app.put("/documents/{doc_id}")
def update_document(doc_id: int, document: dict, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Update content if sent
    if "content" in document:
        doc.content = document["content"]

    # Update title if sent
    if "title" in document:
        doc.title = document["title"]

    db.commit()
    db.refresh(doc)

    return doc