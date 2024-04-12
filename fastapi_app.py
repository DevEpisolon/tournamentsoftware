from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from match import Match
from tournament import Tournament

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["my_database"]
players_collection = db["players"]

# Pydantic models
class Player(BaseModel):
    playerName: str
    displayName: str

# Routes
@app.post("/players/")
async def create_player(player: Player):
    player_dict = player.dict()
    players_collection.insert_one(player_dict)
    return player

@app.delete("/players/{display_name}")
async def delete_player(display_name: str):
    result = players_collection.delete_one({"displayName": display_name})
    if result.deleted_count == 0:
        return {"message": "Player not found"}
    return {"message": "Player deleted successfully"}

@app.post("/matches/")
async def create_match(match: Match):
    # return a recieved match maybe we can call the python fuction we have?
    return match

@app.post("/tournaments/")
async def create_tournament(tournament: Tournament):
    #return a tournament maybe we can return the tournament and the createMatches? 
    return tournament
