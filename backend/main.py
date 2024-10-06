from fastapi import FastAPI
from app.api import satellite, subscribers, sr
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.subscriber import Subscriber as SubscriberModel
from app.models.polling import Polling as PollingModel
from app.core.config import settings
from app.utils.shared import *
from app.utils import s3
from datetime import date

init_db()  # Initialize the database
conv = ConvertToWRS(shapefile="/app/app/api/LatLongToWRS/WRS2_descending.shp")

app = FastAPI(root_path=settings.API_PREFIX)

# Include routers for various endpoints
app.include_router(satellite.router, prefix="/satellite", tags=["Satellite"])
app.include_router(sr.router, prefix="/sr", tags=["SR"])
app.include_router(subscribers.router, prefix="", tags=["Subscribers"])

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

while True:
    print("Polling landsat...")

    db = get_db()
    users = db.query(SubscriberModel).filter(SubscriberModel.active == True, SubscriberModel.unsubscribed == False).all()

    for user in users:
        state = decode_state(user.data)
        for pin in state:
            path_row = conv.get_wrs(pin["lat"], pin["lng"])
            
            if path_row is None or len(path_row) == 0:
                pass    # TODO

            path = path_row[0]["path"]
            row = path_row[0]["row"]

            prefix = 'collection02/level-2/standard/oli-tirs/2024/'+str(path).zfill(3)+'/'+str(row).zfill(3)+'/'

            response = s3.list_objects_v2(
                Bucket=s3.bucket_name,
                Prefix=prefix,
                RequestPayer='requester',
                Delimiter='/'
            )

            prefixes = []
            if 'CommonPrefixes' in response:
                for cp in response['CommonPrefixes']:
                    prefixes.append(cp['Prefix'])

            for prefix in prefixes:
                raw_date = prefix[17:25]
                date = datetime.date(int(raw_date[:4]), int(raw_date[4:6]), int(raw_date[6:]))
                last_updated = db.query(PollingModel).filter(PollingModel.path == path, PollingModel.row == row).first()
                if not last_updated:
                    print(f"No last_updated entry found for path: {path}, row: {row}")
                    break
                if date > last_updated:
                    # an update has been found -- notify the user
                    subscribers.send_updates(db)
                    last_updated = date
                    db.commit()
    
    time.sleep(30 * 60)
