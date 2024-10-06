from fastapi import FastAPI, HTTPException
from skyfield.api import load, EarthSatellite
from datetime import datetime, timedelta

from utils import *

app = FastAPI(root_path="/api")

# Define TLE data for Landsat 8 (this can be updated periodically)
landsat_8_tle = [
    "1 39084U 13008A   23270.47419877  .00000029  00000-0  27947-4 0  9999",
    "2 39084  98.2045 221.3107 0001356  98.0138 262.1118 14.57109887552706"
]

# Load timescale and define the satellite
satellite_db = {
    "landsat_8": EarthSatellite(landsat_8_tle[0], landsat_8_tle[1], "Landsat 8", load.timescale())
}


@app.get("/satellite/")
def get_all_satellites():
    """
    Returns the names of all available satellites.
    """
    return {"satellites": list(satellite_db.keys())}

@app.get("/satellite/{satellite_name}")
def get_satellite_info(satellite_name: str):
    """
    Returns the current location and information of the specified satellite.
    """
    # Check if the requested satellite exists in our database
    satellite = satellite_db.get(satellite_name.lower())
    if not satellite:
        raise HTTPException(status_code=404, detail="Satellite not found")

    # Get the current position of the satellite
    t = load.timescale().now()
    geocentric = satellite.at(t)
    subpoint = geocentric.subpoint()

    # Return the satellite information
    return {
        "name": satellite_name,
        "timestamp": datetime.utcnow().isoformat(),
        "latitude": subpoint.latitude.degrees,
        "longitude": subpoint.longitude.degrees,
        "altitude_km": subpoint.elevation.km
    }

@app.get("/satellite/{satellite_name}/forecast")
def get_satellite_forecast(satellite_name: str, hours: int = 1):
    """
    Returns the forecasted location of the satellite over the next specified hours.
    """
    # Check if the requested satellite exists in our database
    satellite = satellite_db.get(satellite_name.lower())
    if not satellite:
        raise HTTPException(status_code=404, detail="Satellite not found")

    # Generate times over the next 'hours' hours at 15-minute intervals
    ts = load.timescale()
    t0 = ts.now()
    t1 = ts.utc(t0.utc_datetime() + timedelta(hours=hours))
    num_intervals = hours * 16 + 1  # Every 15 minutes
    times = ts.linspace(t0, t1, num_intervals)

    # Compute positions at each time
    positions = []
    for t in times:
        geocentric = satellite.at(t)
        subpoint = geocentric.subpoint()
        positions.append({
            "timestamp": t.utc_iso(),
            "latitude": subpoint.latitude.degrees,
            "longitude": subpoint.longitude.degrees,
            "altitude_km": subpoint.elevation.km
        })

    # Return the forecast data
    return {
        "name": satellite_name,
        "forecast": positions
    }

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

