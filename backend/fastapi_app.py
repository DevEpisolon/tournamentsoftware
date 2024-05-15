import asyncio
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from match_database import match_router
from tournament_database import tournament_router
from player_database import player_router
from fastapi.middleware.cors import CORSMiddleware


# Initialize FastAPI app
app = FastAPI()

# MongoDB Atlas connection string
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"
# Replace <username>, <password>, <cluster-url>, and <dbname> with your actual MongoDB Atlas credentials and database name

# Establish connection to MongoDB Atlas
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the appropriate origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)



# Include the match router in the main application
app.include_router(match_router, prefix="/api")
app.include_router(player_router,prefix="/api")
app.include_router(tournament_router,prefix="/api")

