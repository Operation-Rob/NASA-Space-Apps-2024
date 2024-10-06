from ..utils.s3 import s3, bucket_name
from .LatLongToWRS.get_wrs import ConvertToWRS

from fastapi import APIRouter
import rasterio
from rasterio.io import MemoryFile
from rasterio.warp import transform

router = APIRouter()
conv = ConvertToWRS(shapefile="/app/app/api/LatLongToWRS/WRS2_descending.shp")

def get_path_row(lat: float, lng: float) -> tuple[float, float]:
    path_row = conv.get_wrs(lat, lng)

    if path_row is None or len(path_row) == 0:
        raise Exception("Invalid lat-lng coordinates passed")

    path = path_row[0]['path']
    row = path_row[0]['row']

    return path, row

def get_scene(lat: float, lng: float) -> list[bytes]:
    path, row = get_path_row(lat, lng)

    prefix = 'collection02/level-2/standard/oli-tirs/2024/'+str(path).zfill(3)+'/'+str(row).zfill(3)+'/'    # TODO: allow years other than 2024

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

    if len(prefixes) == 0:
        raise Exception("No scenes found for given lat-lng")

    prefixes.sort(key=lambda x: x[10:-6], reverse=True)
    
    band_contents = []
    for band in range(1,8):
        obj_key = prefixes[0]+prefixes[0].split('/')[-2]+'_SR_B'+str(band)+'.TIF'
        response = s3.get_object(Bucket=s3.bucket_name, Key=obj_key, RequestPayer='requester')
        content = response['Body'].read()
        band_contents.append(content)
    
    return band_contents

@router.get("/data/")
def get_pixel(lat: float, lng: float) -> list[int]:
    band_contents = get_scene(lat, lng)

    values = []
    for content in band_contents:
        with MemoryFile(content) as scene_file:
            with scene_file.open() as scene:
                x, y = transform('EPSG:4326', scene.crs, [lng], [lat])
                row, col = scene.index(x[0], y[0])
                value = scene.read(1)[row,col]    # read from band 1
                values.append(int(value))
                if not value:
                    print(f"Note: found None value for pixel lat: {lat} lng: {lng}")

    return values
