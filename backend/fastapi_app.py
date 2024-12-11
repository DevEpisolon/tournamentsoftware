import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, OperationFailure, DocumentTooLarge
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
from database.match_database import match_router
from database.tournament_database import tournament_router
from database.player_database import player_router

# Load environment variables from .env file
load_dotenv()

# Get the MongoDB connection string from the environment variable
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_URI")
if not MONGODB_CONNECTION_STRING:
    raise ValueError("MONGODB_URI is not set in the environment")

# Initialize MongoDB client
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]

# Initialize Firebase Admin SDK (only once)
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS_PATH")  # Path to your Firebase service account file
if not FIREBASE_CREDENTIALS:
    raise ValueError("FIREBASE_CREDENTIALS_PATH is not set in the environment")

firebase_admin.initialize_app(credentials.Certificate(FIREBASE_CREDENTIALS))

# Initialize FastAPI app
app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the appropriate origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def exception_handler(_, __):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"},
    )

# MongoDB exception handlers
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
app.include_router(match_router, prefix="/api")
app.include_router(player_router, prefix="/api")
app.include_router(tournament_router, prefix="/api")

# Include routers with database dependency
#app.include_router(match_router, prefix="/api", dependencies=[Depends(lambda: db)])
#app.include_router(player_router, prefix="/api", dependencies=[Depends(lambda: db)])
#app.include_router(tournament_router, prefix="/api", dependencies=[Depends(lambda: db)])



# Test database connection
@app.get("/test_db")
async def test_db():
    try:
        # Test MongoDB connection by pinging the server
        client.admin.command("ping")
        return {"message": "MongoDB connection successful"}
    except Exception as e:
        return {"error": str(e)}

# Root route
@app.get("/")
async def root():
    return {"message": "Welcome to the Tournament Software!"}
