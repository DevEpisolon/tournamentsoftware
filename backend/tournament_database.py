from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient

app = APIRouter()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["tournamentssoftware"]
tournaments_collection = db["tournaments"]

# Function to fetch tournament data from the database by ID
def fetch_tournament_data_from_database(tournament_id: int):
    return tournaments_collection.find_one({"_id": tournament_id})

# Router to create a new tournament
@app.post("/create_tournament/")
def create_tournament(tournament_input: dict):
    tournament_data = tournament_input
    tournament_data["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    result = tournaments_collection.insert_one(tournament_data)
    return {"message": "Tournament created successfully", "tournament_id": str(result.inserted_id)}

# Router to get a specific tournament by ID
@app.get("/{item_id}")
def get_tournament(item_id: int):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return tournament_data

# Router to fetch all tournaments
@app.get("/tournaments")
def view_tournaments():
    tournaments_data = list(tournaments_collection.find())
    if not tournaments_data:
        raise HTTPException(status_code=404, detail="No tournaments found")
    return tournaments_data

