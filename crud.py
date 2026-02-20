from sqlalchemy.orm import Session
import models
import schemas

def create_document(db: Session, doc: schemas.DocumentCreate):
    new_doc = models.Document(title=doc.title, content=doc.content)
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

def get_documents(db: Session):
    return db.query(models.Document).all()