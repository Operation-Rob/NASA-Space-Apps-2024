from s3 import s3, bucket_name
import time


while True:
    print("Polling landsat...")
    
    path, row = 0, 0
    prefix = 'collection02/level-2/standard/oli-tirs/2024/'+str(path).zfill(3)+'/'+str(row).zfill(3)+'/'
    response = s3.list_objects_v2(
        Bucket=s3.bucket_name,
        Prefix=prefix,
        RequestPayer='requester'
    )

    objects = []
    if 'Contents' in response:
        for obj in response['Contents']:
            objects.append(obj['Key'])

    if len(prefixes) == 0:
        raise Exception("No scenes found for given lat-lng")

    prefixes.sort(key=lambda x: x[10:-6], reverse=True)

    # sleep 30 min
    time.sleep(30 * 60)
