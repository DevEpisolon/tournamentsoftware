from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from tournament import Tournament

tournament_router = APIRouter()

# Connect to MongoDB
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]
tournaments_collection = db["tournaments"]

# Function to fetch tournament data from the database by ID
def fetch_tournament_data_from_database(tournament_id: int):
    return tournaments_collection.find_one({"_id": tournament_id})

# Router to get a specific tournament by ID
@tournament_router.get("/{item_id}")
def get_tournament(item_id: int):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return tournament_data

# Function to set the tournament ID
def set_tournament_id():
    return tournaments_collection.count_documents({}) + 1

# Router to fetch all tournaments
@tournament_router.get("/tournaments")
def view_tournaments():
    tournaments_data = list(tournaments_collection.find())
    if not tournaments_data:
        raise HTTPException(status_code=404, detail="No tournaments found")
    return tournaments_data

# Router to create a new tournament
@tournament_router.post("/create_tournament/")
def create_tournament(tournament_name: str, max_slots: int):
    tournament_data = Tournament(
        tournamentName=tournament_name,
        tournamentID=set_tournament_id(),
        max_slots=max_slots,
        STATUS="New",  # default status
        STARTDATE=datetime.now(),  # default start date
        ENDDATE=None,  # default end date
        createdAt=datetime.now(),  # default creation date
        updatedAt=None,  # default update date
        max_rounds=0,  # default max rounds
        matches=[],  # default empty matches
        MaxSlotsCount=None,  # default max slots count
        TournamentType=None,  # default tournament type
        TeamBoolean=None,  # default team boolean
        AllotedMatchTime=None,  # default alloted match time
        Players=[],  # default empty players list
        tournamentWinner=None,  # default tournament winner
        droppedPlayers=[]  # default empty dropped players list
    )
    tournament_data_dict = tournament_data.__dict__
    result = tournaments_collection.insert_one(tournament_data_dict)
    return {"message": "Tournament created successfully", "tournament_id": str(result.inserted_id)}

@tournament_router.get("/tournamentplayers/{tournament_id}")
def get_tournament_players(tournament_id: str):
    # Fetch tournament data from the database by ID
    tournament_data = tournaments_collection.find_one({"_id": tournament_id})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Instantiate Tournament class with fetched data
    tournament = Tournament(**tournament_data)

    # Get the players from the tournament
    tournament_players = tournament.get_Players()
    
    return tournament_players
