import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from match_database import match_router
from tournament_database import tournament_router
from player_database import player_router
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, OperationFailure, DocumentTooLarge
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the MongoDB connection string from the environment variable
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_URI")
if not MONGODB_CONNECTION_STRING:
    raise ValueError("MONGODB_URI is not set in the environment")

# Initialize MongoDB client
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]



# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the appropriate origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def exception_handler(_, __):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"},
    )


app.include_router(match_router, prefix="/api", dependencies=[Depends(lambda: db)])
app.include_router(player_router, prefix="/api", dependencies=[Depends(lambda: db)])
app.include_router(tournament_router, prefix="/api", dependencies=[Depends(lambda: db)])


# Some of the MongoDB exceptions that could be caused. 
@app.exception_handler(ConnectionFailure)
async def handle_connection_failure(_, __):
    return JSONResponse(
        status_code=503,
        content={"message": "Could not connect to the database, please try again later."},
    )

@app.exception_handler(ServerSelectionTimeoutError)
async def handle_server_selection_timeout(_, __):
    return JSONResponse(
        status_code=503,
        content={"message": "Database server selection timed out, please check your connection."},
    )

@app.exception_handler(OperationFailure)
async def handle_operation_failure(_, exc: OperationFailure):
    return JSONResponse(
        status_code=500,
        content={"message": f"Operation failed: {exc.details}"},
    )

@app.exception_handler(DocumentTooLarge)
async def handle_document_too_large(_, __):
    return JSONResponse(
        status_code=413,
        content={"message": "The document you are trying to save is too large."},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to the Tournament Software!"}
