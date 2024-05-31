from functools import wraps
from firebase_admin import auth
from fastapi import Request

def verify_firebase_token(request: Request):
    '''Function to verify Firebase ID token in request headers.'''
    # Get the Authorization header
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return {
            "status": 401, 
            "message": "Authorization header is missing"
        }

    # Attempt to extract the token from the header
    parts = auth_header.split()
        
    if len(parts) == 2 and parts[0].lower() == "bearer":
        id_token = parts[1]
    else:
        return {"error": "Authorization header must be Bearer token", "status": 401}
        
    try:
        # Verify the ID token and decode its payload
        decoded_token = auth.verify_id_token(id_token)
        request.user = decoded_token
    except Exception as e:
        return {"error": "Invalid or expired token", "status": 403}
    return {
        "error": None,
        "status": 100,
        "decoded_token": decoded_token
    }
