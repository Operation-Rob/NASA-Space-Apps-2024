from ..utils.s3 import s3, bucket_name
from ..utils.shared import scale_value
from .LatLongToWRS.get_wrs import ConvertToWRS

from fastapi import APIRouter
import rasterio
from rasterio.io import MemoryFile
from rasterio.warp import transform
import concurrent.futures

router = APIRouter()
conv = ConvertToWRS(shapefile="/app/app/api/LatLongToWRS/WRS2_descending.shp")

def get_path_row(lat: float, lng: float) -> tuple[float, float]:
    path_row = conv.get_wrs(lat, lng)

    if path_row is None or len(path_row) == 0:
        raise Exception("Invalid lat-lng coordinates passed")

    path = path_row[0]['path']
    row = path_row[0]['row']

    return path, row

def download_band(name: str, band: int) -> bytes:
    obj_key = name+name.split('/')[-2]+'_SR_B'+str(band)+'.TIF'
    response = s3.get_object(Bucket=bucket_name, Key=obj_key, RequestPayer='requester')
    content = response['Body'].read()
    return content

def get_scene(lat: float, lng: float) -> list[bytes]:
    path, row = get_path_row(lat, lng)

    prefix = 'collection02/level-2/standard/oli-tirs/2024/'+str(path).zfill(3)+'/'+str(row).zfill(3)+'/'    # TODO: allow years other than 2024

    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=prefix,
        RequestPayer='requester',
        Delimiter='/'
    )

    prefixes = []
    if 'CommonPrefixes' in response:
        for cp in response['CommonPrefixes']:
            prefixes.append(cp['Prefix'])

    if len(prefixes) == 0:
        raise Exception("No scenes found for given lat-lng")

    prefixes.sort(key=lambda x: x[10:-6], reverse=True)
    
    bands = range(1,8)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        band_contents = list(executor.map(lambda x: download_band(prefixes[0], x), bands))
    
    return band_contents

def process_band(content: bytes, lat: float, lng: float) -> int:
    with MemoryFile(content) as scene_file:
        with scene_file.open() as scene:
            x, y = transform('EPSG:4326', scene.crs, [lng], [lat])
            row, col = scene.index(x[0], y[0])
            value = scene.read(1)[row,col]    # read from band 1
            if not value:
                print(f"Note: found None value for pixel lat: {lat} lng: {lng}")
            return int(value)
            

@router.get("/data/")
def get_pixel(lat: float, lng: float) -> list[int]:
    band_contents = get_scene(lat, lng)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        values = list(executor.map(lambda content: process_band(content, lat, lng), band_contents))

    return map(scale_value, values)
