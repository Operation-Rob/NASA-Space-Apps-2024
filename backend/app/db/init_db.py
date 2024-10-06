from app.db.session import engine
from app.db.base import Base
from app.models.subscriber import Subscriber
from app.models.token import Token
from app.models.polling import Polling

def init_db():
    Base.metadata.create_all(bind=engine)
