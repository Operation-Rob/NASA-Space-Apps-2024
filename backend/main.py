from fastapi import FastAPI
from app.api import satellite, subscribers, sr
from app.api.LatLongToWRS.get_wrs import ConvertToWRS
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.subscriber import Subscriber as SubscriberModel
from app.models.polling import Polling as PollingModel
from app.core.config import settings
from app.utils.shared import *
from app.utils.s3 import s3
from datetime import date, datetime
import time
import threading
import re

import time
import threading

def polling_task():
    while True:
        print("Polling landsat...")

        with SessionLocal() as db:
            users = db.query(SubscriberModel).filter(
                SubscriberModel.active == True, SubscriberModel.unsubscribed == False
            ).all()

            users_to_notify = set()

            for user in users:
                need_to_notify_user = False
                state = decode_state(user.data)
                for pin in state:
                    path_row = conv.get_wrs(pin["lat"], pin["lng"])

                    if path_row is None or len(path_row) == 0:
                        print(f"No WRS path/row found for pin at ({pin['lat']}, {pin['lng']})")
                        continue  # Skip to the next pin

                    path = path_row[0]["path"]
                    row = path_row[0]["row"]

                    current_year = datetime.now().year
                    prefix = f'collection02/level-2/standard/oli-tirs/{current_year}/{str(path).zfill(3)}/{str(row).zfill(3)}/'

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
                        # Extract date using regex
                        match = re.search(r'/(\d{4})(\d{2})(\d{2})/', prefix)
                        if match:
                            year, month, day = match.groups()
                            parsed_date = date(int(year), int(month), int(day))
                        else:
                            print(f"Date not found in prefix: {prefix}")
                            continue  # Skip to the next prefix

                        polling_entry = db.query(PollingModel).filter(
                            PollingModel.path == path, PollingModel.row == row
                        ).first()
                        if not polling_entry:
                            print(f"No polling entry found for path: {path}, row: {row}")
                            # Create new polling entry
                            polling_entry = PollingModel(path=path, row=row, last_updated=parsed_date)
                            db.add(polling_entry)
                            db.commit()
                            continue  # Skip to the next prefix

                        if parsed_date > polling_entry.last_updated:
                            # Update detected
                            need_to_notify_user = True
                            # Update last_updated
                            polling_entry.last_updated = parsed_date
                            db.commit()
                            break  # No need to check more prefixes for this pin

                if need_to_notify_user:
                    users_to_notify.add(user)

            # After processing all users, send updates
            for user in users_to_notify:
                subscribers.send_updates(user, db)

        time.sleep(30 * 60)


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

@app.on_event("startup")
def start_polling():
    polling_thread = threading.Thread(target=polling_task)
    polling_thread.daemon = True  # Daemonize thread to exit when main thread exits
    polling_thread.start()
