from mongo import MongoDB
from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from objects.tournament import Tournament
from objects.player import Player
from database.player_database import *
from database.match_database import *
import asyncio
from objects.match import Match
import random
import string

tournament_router = APIRouter()


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
tournaments_collection = db["tournaments"]


def generate_join_id():
    """Generate a unique 4-character join ID consisting of digits and letters."""
    characters = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return "".join(random.choices(characters, k=6))


def generate_unique_join_id():
    """Generate a unique 4-character join ID and ensure no duplicates."""
    while True:
        join_id = generate_join_id()
        # Check if the join_id already exists in the database
        existing_tournament = tournaments_collection.find_one({"join_id": join_id})
        if not existing_tournament:  # If no existing tournament with this join_id
            return join_id


def document_to_tournament(tournament_document):
    if tournament_document:
        return Tournament(**tournament_document)
    else:
        print("Tournament not found.")
        return None


def create_tournament_object(tournament_data):
    if tournament_data:
        tournament_data.pop("_id", None)  # Remove _id field from the data
        return Tournament(**tournament_data)
    else:
        print("Tournament data is None.")
        return None


def fetch_tournament_data_from_database(tournament_id: str):
    try:
        tournament_id_obj = ObjectId(tournament_id)
        return tournaments_collection.find_one({"_id": tournament_id_obj})
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid tournament ID")


def fetch_tournament_data_from_database_by_join_code(join_code: str):
    try:
        # Query the database using the join_code field
        tournament_data = tournaments_collection.find_one({"join_code": join_code})

        # Check if the tournament data exists
        if not tournament_data:
            raise HTTPException(status_code=404, detail="Tournament not found")

        return tournament_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# fetches the objectid for the tourament and promote all players within the round if they are finished
@tournament_router.put("/tournaments/{tournament_id}/promote_players/{round_number}")
async def promote_players(tournament_id: str, round_number: int):
    """
    Promote players from the current round to the next round.
    """
    # Validate tournament ID
    try:
        obj_id = ObjectId(tournament_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tournament ID format.")

    # Fetch the tournament
    tournament_data = fetch_tournament_data_from_database(tournament_id)
    if not tournament_data:
        raise HTTPException(status_code=404, detail="Tournament not found.")

    tournament = create_tournament_object(tournament_data)

    # Promote players
    try:
        tournament.promotePlayersInRound(round_number)
        updated_tournament = tournament_to_document(tournament)

        # Update tournament in the database
        tournaments_collection.replace_one({"_id": obj_id}, updated_tournament)

        return {
            "status": "success",
            "message": f"Players promoted from round {round_number} to round {round_number + 1} successfully.",
        }
    except Exception as e:
        print(f"Error in promoting players: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to promote players: {str(e)}"
        )


@tournament_router.get("/tournaments/{item_id}")
def get_tournament_byid(item_id: str):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return create_tournament_object(tournament_data)


@tournament_router.get("/tournaments/join/{join_code}")
def get_tournament_byJoinCode(join_code: str):
    tournament_data = fetch_tournament_data_from_database_by_join_code(join_code)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    # Return the response with a success flag
    return {"success": True, "tournament": create_tournament_object(tournament_data)}


@tournament_router.get("/tournaments")
def view_tournaments():
    tournament_data = list(tournaments_collection.find({}))
    if not tournament_data:
        raise HTTPException(status_code=404, detail="No tournaments found")
    # Include the MongoDB _id in the response
    tournaments = [
        {"_id": str(tournament.pop("_id")), **tournament}
        for tournament in tournament_data
    ]
    return tournaments


@tournament_router.post("/tournaments/create")
async def create_tournament(tournament: dict):
    tournament_name = tournament.get("tournament_name")
    max_slots = tournament.get("max_slots")

    if not tournament_name or not max_slots:
        raise HTTPException(status_code=400, detail="Invalid input data")

    new_tournament = Tournament(
        tournamentName=tournament_name,
        STATUS=1,
        STARTDATE=datetime.now(),
        ENDDATE=None,
        createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updatedAt=None,
        max_rounds=1,
        maxSlotsPerMatch=2,
        MaxSlotsCount=max_slots,
        TournamentType=None,
        TeamBoolean=None,
        AllotedMatchTime=None,
        Players=[],
        tournamentWinner=None,
        droppedPlayers=[],
        wins_dict={},
        losses_dict={},
        ties_dict={},
        join_code=generate_unique_join_id(),
    )

    tournament_data = new_tournament._to_dict()
    inserted_id = tournaments_collection.insert_one(tournament_data).inserted_id
    return {"id": str(inserted_id), "message": "Tournament successfully created"}


@tournament_router.put("/add_player/{tournament_id}/{player_display_name}")
def add_player_to_tournament_by_display_name(
    tournament_id: str, player_display_name: str
):
    # Ensure that the tournament_data retrieved from the database does not contain '_id' attribute
    tournament_data = tournaments_collection.find_one(
        {"_id": ObjectId(tournament_id)}, {"_id": 0}
    )

    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    player_data = players_collection.find_one(
        {"displayname": player_display_name}, {"_id": 0}
    )
    if player_data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Player with display name {player_display_name} not found!",
        )

    # Create Player object
    player = Player(**player_data)

    # Convert Player object to dictionary
    player_dict = player.__dict__

    # Remove _id field from player_dict if present
    player_dict.pop("_id", None)

    tournament = Tournament(**tournament_data)

    tournament.addPlayertoTournament(player_dict)

    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}},
    )

    return {"message": f"Player {player_display_name} added to tournament successfully"}


@tournament_router.put("/remove_player/{tournament_id}/{player_display_name}")
def remove_player_from_tournament_by_display_name(
    tournament_id: str, player_display_name: str
):
    # Ensure that the tournament_data retrieved from the database does not contain '_id' attribute
    tournament_data = tournaments_collection.find_one(
        {"_id": ObjectId(tournament_id)}, {"_id": 0}
    )

    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    player_data = players_collection.find_one(
        {"displayname": player_display_name}, {"_id": 0}
    )
    if player_data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Player with display name {player_display_name} not found!",
        )

    # Create Player object
    player = Player(**player_data)

    # Convert Player object to dictionary
    player_dict = player.__dict__

    # Remove _id field from player_dict if present
    player_dict.pop("_id", None)

    tournament = Tournament(**tournament_data)

    tournament.removePlayerfromTournament(player_dict)

    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}},
    )

    return {
        "message": f"Player {player_display_name} removed from tournament successfully"
    }


@tournament_router.put("/update_status/{tournament_id}/{updatedStatus}")
def set_status_by_id(tournament_id: str, updatedStatus: str):
    try:
        tournament_id_obj = ObjectId(tournament_id)
        tournament = tournaments_collection.find_one({"_id": tournament_id_obj})
        if tournament:
            result = tournaments_collection.update_one(
                {"_id": tournament_id_obj}, {"$set": {"STATUS": updatedStatus}}
            )
            if result.modified_count == 1:
                return {"Message": "Tournament status updated successfully!"}
            else:
                raise HTTPException(
                    status_code=500, detail="Unable update tournament status."
                )
        else:
            raise HTTPException(status_code=404, details="Tournament not found!")
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


@tournament_router.put("/tournament_remove/{tournament_id}")
def delete_tournament_by_id(tournament_id: str):
    tournament_id_obj = ObjectId(tournament_id)
    result = tournaments_collection.delete_one({"_id": tournament_id_obj})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    else:
        return {"message": "Tournament deleted successfully"}


def tournament_to_document(tournament):

    serialized_players = [player for player in tournament.Players]
    serialized_matches = [match_to_document(match) for match in tournament.matches]
    return {
        "tournamentName": tournament.tournamentName,
        "STATUS": tournament.STATUS,
        "STARTDATE": tournament.STARTDATE,
        "ENDDATE": tournament.ENDDATE,
        "createdAt": tournament.createdAt,
        "updatedAt": tournament.updatedAt,
        "matches": serialized_matches,
        "MaxSlotsCount": tournament.MaxSlotsCount,
        "TournamentType": tournament.TournamentType,
        "TeamBoolean": tournament.TeamBoolean,
        "AllotedMatchTime": tournament.AllotedMatchTime,
        "Players": serialized_players,
        "tournamentWinner": tournament.tournamentWinner,
        "droppedPlayers": tournament.droppedPlayers,
        "maxSlotsPerMatch": tournament.maxSlotsPerMatch,
        "max_rounds": tournament.max_rounds,
        "wins_dict": tournament.wins_dict,
        "losses_dict": tournament.losses_dict,
        "ties_dict": tournament.ties_dict,
        "join_code": tournament.join_code,
    }


@tournament_router.put("/create_matches/{tournament_id}")
async def create_matches(tournament_id):
    # 1. First, validate tournament_id format
    try:
        obj_id = ObjectId(tournament_id)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid tournament ID format: {str(e)}",
        )

    # 2. Get tournament
    tournament = get_tournament_byid(tournament_id)
    if tournament is None:
        raise HTTPException(
            status_code=404, detail=f"Tournament with ID {tournament_id} not found"
        )

    try:
        # 3. Create matches and assign players
        tournament.CreateMatches1()
        tournament.assignPlayersToMatches1()

        # 4. Convert tournament with matches to document format
        matches_docs = []
        for match in tournament.matches:
            match_doc = match_to_document(match)
            await post_match(match_doc)
            matches_docs.append(match_doc)

        # 5. Update tournament document with new matches
        tournaments_collection.update_one(
            {"_id": obj_id}, {"$set": {"matches": matches_docs}}
        )

        return {
            "status": "success",
            "message": "Matches created successfully",
            "tournament_id": str(tournament_id),
        }

    except Exception as e:
        print(f"Unexpected error in create_matches: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create matches: {str(e)}"
        )
