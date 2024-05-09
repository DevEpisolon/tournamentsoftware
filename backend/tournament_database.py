from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from tournament import Tournament
from player import Player
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
@tournament_router.post("/create_tournament/")
def create_tournament(tournament_name: str, max_slots: int):
    tournament_data = Tournament(
        tournamentName=tournament_name,
        tournamentId=set_tournament_id(),  # Set the tournament ID
        STATUS=0,  # Default status
        STARTDATE=datetime.now(),  # Default start date
        ENDDATE=None,  # Default end date
        createdAt=datetime.now(),  # Default creation date
        updatedAt=None,  # Default update date
        max_rounds=1,  # Default max rounds
        matches=[],  # Default empty matches
        MaxSlotsCount=max_slots,  # Default max slots count
        TournamentType=None,  # Default tournament type
        TeamBoolean=None,  # Default team boolean
        AllotedMatchTime=None,  # Default alloted match time
        Players=[],  # Default empty players list
        tournamentWinner=None,  # Default tournament winner
        droppedPlayers=[]  # Default empty dropped players list
    )
    tournament_data_dict = tournament_data.__dict__
    result = tournaments_collection.insert_one(tournament_data_dict)
    return {"message": "Tournament created successfully", "tournament_id": str(result.inserted_id)}

@tournament_router.put("/add_player/{tournament_id}/{player_display_name}")
def add_player_to_tournament_by_display_name(tournament_id: str, player_display_name: str):
    # Fetch tournament data from the database by ID
    tournament_data = tournaments_collection.find_one({"_id": tournament_id})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Instantiate Tournament class with fetched data
    tournament = Tournament(**tournament_data)

    # Fetch player data from the database by display name
    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    # Instantiate Player class with fetched data
    player = Player(**player_data)

    # Add player to the tournament
    tournament.addPlayertoTournament(player)

    # Update tournament data in the database
    tournaments_collection.update_one(
        {"_id": tournament_id},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} added to tournament successfully"}

@tournament_router.put("/remove_player/{tournament_id}/{player_display_name}")
def remove_player_from_tournament_by_display_name(tournament_id: str, player_display_name: str):
    # Fetch tournament data from the database by ID
    tournament_data = tournaments_collection.find_one({"_id": tournament_id})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Instantiate Tournament class with fetched data
    tournament = Tournament(**tournament_data)

    # Fetch player data from the database by display name
    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    # Instantiate Player class with fetched data
    player = Player(**player_data)

    # Remove player from the tournament
    tournament.removePlayerfromTournament(player)

    # Update tournament data in the database
    tournaments_collection.update_one(
        {"_id": tournament_id},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} removed from tournament successfully"}

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

# Function to add a test tournament to the database
def add_test_tournament():
    # Call create_tournament function with predefined values
    return create_tournament(tournament_name="test tournament", max_slots=8)

# Add a test tournament to the database
add_test_tournament()

