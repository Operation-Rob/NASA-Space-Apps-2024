
from fastapi import FastAPI
from app.api import satellite, subscribers
from app.db.init_db import init_db
from app.core.config import settings

init_db()  # Initialize the database

app = FastAPI(root_path=settings.API_PREFIX)

# Include routers for various endpoints
app.include_router(satellite.router, prefix="/satellite", tags=["Satellite"])
app.include_router(subscribers.router, prefix="", tags=["Subscribers"])

@app.get("/")
def read_root():
    return {"message": "Hello World!"}
