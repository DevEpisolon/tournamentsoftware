from fastapi import FastAPI, HTTPException, APIRouter
from datetime import datetime
from pydantic import BaseModel
from pymongo import MongoClient
from tournament import Tournament  # Import the Tournament class from tournament.py

app = APIRouter()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
#databae name idk it yet
db = client["tournament_database"]
#probally called tournaments? yet to confirm
tournaments_collection = db["tournaments"]

# Pydantic model for tournament creation
#yeah i said that :smirk:
class TournamentInput(BaseModel):
    tournament: Tournament

# Router
@app.post("/create_tournament/")
def create_tournament(tournament_input: TournamentInput):
    tournament_data = tournament_input.tournament.dict()
    tournament_data["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    result = tournaments_collection.insert_one(tournament_data)
    return {"message": "Tournament created successfully", "tournament_id": str(result.inserted_id)}


#to get a tournament to view should i incorporate a view all active tournaments?
@router.get("/{item_id}")
async def get_tournaments(item_id: int):
    return {"item_id": item_id}
