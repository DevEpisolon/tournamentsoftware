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
from fastapi_app import db, client


tournament_router = APIRouter()

b = client["tournamentsoftware"]
tournaments_collection = db["tournaments"]

# db = MongoDB().getDb()
# tournaments_collection = db["tournaments"]
players_collection = db["players"]


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


@tournament_router.get("/tournaments/{item_id}")
def get_tournament_byid(item_id: str):
    tournament_data = fetch_tournament_data_from_database(item_id)
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    return create_tournament_object(tournament_data)


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


@tournament_router.post("/tournaments/create/{tournament_name}:{max_slots}")
def create_tournament(tournament_name: str, max_slots: int):
    tournament = Tournament(
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
    )

    tournament_data = tournament.to_dict()

    # Insert tournament data into collection
    tournaments_collection.insert_one(tournament_data)


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

    # 2. Get tournament with null check
    tournament = get_tournament_byid(tournament_id)
    if tournament is None:
        raise HTTPException(
            status_code=404, detail=f"Tournament with ID {tournament_id} not found"
        )

    # 3. Split the operations for better error tracking
    try:
        # Create matches
        tournament.createMatches()

        # Convert to document format
        try:
            updated_tournament = tournament_to_document(tournament)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to convert tournament to document: {str(e)}",
            )

        # Update in database
        try:
            print(updated_tournament)
            result = tournaments_collection.replace_one(
                {"_id": obj_id}, updated_tournament
            )
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=500, detail="Failed to update tournament in database"
                )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Database update failed: {str(e)}"
            )

        # Create match documents
        try:
            for match in tournament.matches:
                match_doc = match_to_document(match)
                await post_match(match_doc)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to create match documents: {str(e)}"
            )

    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Log the full error for debugging
        print(f"Unexpected error in create_matches: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create matches: {str(e)}"
        )

    # Return success response
    return {
        "status": "success",
        "message": "Matches created successfully",
        "tournament_id": str(tournament_id),
    }