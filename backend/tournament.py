from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from tournament import Tournament  # Import the Tournament class from tournament.py
from typing import List, Optional

app = APIRouter()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["tournamentssoftware"]
tournaments_collection = db["tournaments"]

# Router
@app.post("/create_tournament/")
def create_tournament(tournament_input: dict):
    tournament_data = tournament_input
    tournament_data["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    result = tournaments_collection.insert_one(tournament_data)
    return {"message": "Tournament created successfully", "tournament_id": str(result.inserted_id)}

#to get a tournament to view should i incorporate a view all active tournaments?
@app.get("/{item_id}")
def get_tournaments(item_id: int):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return tournament_data

