from auth import verify_firebase_token
from tournament import router
from typing import Union
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
app.include_router(router, prefix="/tournament", tags=["tournament"])


@app.get("/")
async def read_root(request: Request):

    ### Demo Code for checking authentication in a protected route.
    # checkAuth = await verify_firebase_token(request)
    # if (checkAuth["error"] != None):
    #     raise HTTPException(status_code=checkAuth["status"], detail=checkAuth["error"])

    return {"Hello": "World"}

@app.exception_handler(Exception)
def handle_internal_server_error(e):
    '''A simple error handler for un-catched exceptions. Helps keep the server alive.'''
    # Log the error information for debugging purposes
    app.logger.error(f"Internal Server Error: {e}")

    # Return a JSON response with a 500 Internal Server Error status code
    return HTTPException(500, "An internal error has occurred.")
