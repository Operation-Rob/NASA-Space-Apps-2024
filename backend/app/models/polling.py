from sqlalchemy import Column, Integer, String, Boolean, Date
from datetime import date
from app.db.base import Base

class Polling(Base):
    __tablename__ = 'polling'

    id = Column(Integer, primary_key=True, index=True)
    path = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)
    last_updated = Column(Date, default=date(2024, 9, 1))
