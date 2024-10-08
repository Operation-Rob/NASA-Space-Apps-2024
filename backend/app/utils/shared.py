import base64
import json

def decode_state(state: str) -> list[dict]:
    try:
        json_bytes = base64.b64decode(state)
        json_state = json_bytes.decode('utf-8')
        state_obj = json.loads(json_state)
    except:
        raise Exception("Invalid encoded state passed")

    return state_obj

def scale_value(val: int) -> float:
    return val / 2**16
