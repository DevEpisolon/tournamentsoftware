from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId  # Import ObjectId from bson module
from tournament import Tournament
from player import Player

tournament_router = APIRouter()

# Connect to MongoDB
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]
tournaments_collection = db["tournaments"]

def tournament_to_document(tournament):

    serialized_players = [player_to_document(player) for player in tournament.Players]
    serialized_matches = [match_to_document(match) for match in tournament.matches]
    return {
        "tournament_name": tournament.tournamentName,
        "status": tournament.STATUS,
        "start_date": tournament.STARTDATE,
        "end_date": tournament.ENDDATE,
        "created_at": tournament.createdAt,
        "updated_at": tournament.updatedAt,
        "matches": serialized_matches,
        "max_slots_count": tournament.MaxSlotsCount,
        "tournament_type": tournament.TournamentType,
        "team_boolean": tournament.TeamBoolean,
        "alloted_match_time": tournament.AllotedMatchTime,
        "players": serialized_players,
        "tournament_winner": tournament.tournamentWinner,
        "dropped_players": tournament.droppedPlayers,
        "max_slots_per_match": tournament.maxSlotsPerMatch,
        "max_rounds": tournament.max_rounds,
    }


def document_to_tournament(tournament_document):
    players = []
    matches = []
    if tournament_document is not None:
        players_document = tournament_document.get("players")
        players = [document_to_player(player_doc) for player_doc in players_document]
        matches_document = tournament_document.get("matches")
        matches = [document_to_match(match_doc) for match_doc in matches_document]
    if tournament_document:
        tournament = Tournament(
            tournamentName=tournament_document.get("tournament_name"),
            STATUS=tournament_document.get("status"),
            STARTDATE=tournament_document.get("start_date"),
            ENDDATE=tournament_document.get("end_date"),
            createdAt=tournament_document.get("created_at"),
            updatedAt=tournament_document.get("updated_at"),
            matches=matches,
            MaxSlotsCount=tournament_document.get("max_slots_count"),
            TournamentType=tournament_document.get("tournament_type"),
            TeamBoolean=tournament_document.get("team_boolean"),
            AllotedMatchTime=tournament_document.get("alloted_match_time"),
            Players=players,
            tournamentWinner=tournament_document.get("tournament_winner"),
            droppedPlayers=tournament_document.get("dropped_player"),
            maxSlotsPerMatch=tournament_document.get("max_slots_per_match"),
            max_rounds=tournament_document.get("max_rounds")
        )
        return tournament
    else:
        print("Tournament not found.")
        return None


# Function to fetch tournament data from the database by ID
def fetch_tournament_data_from_database(tournament_id: str):
    # Convert tournament_id to ObjectId
    tournament_id_obj = ObjectId(tournament_id)
    return tournaments_collection.find_one({"_id": tournament_id_obj})

# Router to get a specific tournament by ID
@tournament_router.get("/{item_id}")
def get_tournament(item_id: str):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return tournament_data

@tournament_router.get("/tournaments")
def view_tournaments():
    tournament_data = list(tournaments_collection.find({}))
    tournaments = [document_to_tournament(tournament) for tournament in tournament_data]
    return tournaments

# Function to create a new tournament
def create_tournament(tournament_name: str, max_slots: int):
    # Create a Tournament object with provided data
    tournament = Tournament(
        tournamentName=tournament_name,
        STATUS=0,
        STARTDATE=datetime.now(),
        ENDDATE=None,
        createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updatedAt=None,
        max_rounds=1,
        maxSlotsPerMatch=2,  # Ensure maxSlotsPerMatch is always 2
        MaxSlotsCount=max_slots,
        TournamentType=None,
        TeamBoolean=None,
        AllotedMatchTime=None,
        Players=[],
        tournamentWinner=None,
        droppedPlayers=[],
        wins_dict={},
        losses_dict={},
        ties_dict={}
    )

    # Convert Tournament object to dictionary
    tournament_data = tournament.to_dict()

    # Insert tournament data into the database
    tournaments_collection.insert_one(tournament_data)

    # Return the generated tournament ID
    return str(tournament_data["_id"])


# Function to add a player to a tournament by display name
@tournament_router.put("/add_player/{tournament_id}/{player_display_name}")
def add_player_to_tournament_by_display_name(tournament_id: str, player_display_name: str):
    # Fetch tournament data from the database by ID
    tournament_data = tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Fetch player data from the database by display name
    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    # Instantiate Tournament class with fetched data
    tournament = Tournament(**tournament_data)

    # Instantiate Player class with fetched data
    player = Player(**player_data)

    # Add player to the tournament
    tournament.addPlayertoTournament(player)

    # Update tournament data in the database
    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} added to tournament successfully"}

# Function to remove a player from a tournament by display name
@tournament_router.put("/remove_player/{tournament_id}/{player_display_name}")
def remove_player_from_tournament_by_display_name(tournament_id: str, player_display_name: str):
    # Fetch tournament data from the database by ID
    tournament_data = tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Fetch player data from the database by display name
    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    # Instantiate Tournament class with fetched data
    tournament = Tournament(**tournament_data)

    # Instantiate Player class with fetched data
    player = Player(**player_data)

    # Remove player from the tournament
    tournament.removePlayerfromTournament(player)

    # Update tournament data in the database
    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} removed from tournament successfully"}
@tournament_router.put("/tournament_remove/{tournament_id}")
def delete_tournament_by_id(tournament_id: str):
    # Convert tournament_id to ObjectId
    tournament_id_obj = ObjectId(tournament_id)
    
    # Delete the tournament from the database
    result = tournaments_collection.delete_one({"_id": tournament_id_obj})
    
    # Check if the deletion was successful
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    else:
        return {"message": "Tournament deleted successfully"}

create_tournament("Test of tournamnet database",16)
