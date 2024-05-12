from fastapi import APIRouter, HTTPException
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from tournament import Tournament
from player import Player

tournament_router = APIRouter()

MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]
tournaments_collection = db["tournaments"]

def document_to_tournament(tournament_document):
    if tournament_document:
        return Tournament(**tournament_document)
    else:
        print("Tournament not found.")
        return None

def create_tournament_object(tournament_data):
    if tournament_data:
        tournament_data.pop('_id', None)  # Remove _id field from the data
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

@tournament_router.get("tournaments/{item_id}")
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
    tournaments = [create_tournament_object(tournament) for tournament in tournament_data]
    return tournaments

@tournament_router.post("/tournaments/{tournament_name}")
async def create_tournament(tournament_name: str, max_slots: int):
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
        ties_dict={}
    )

    tournament_data = tournament.to_dict()

    tournaments_collection.insert_one(tournament_data)

    return create_tournament_object(tournament_data)

@tournament_router.put("/add_player/{tournament_id}/{player_display_name}")
def add_player_to_tournament_by_display_name(tournament_id: str, player_display_name: str):
    tournament_data = tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    tournament = Tournament(**tournament_data)
    player = Player(**player_data)

    tournament.addPlayertoTournament(player)

    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} added to tournament successfully"}

@tournament_router.put("/remove_player/{tournament_id}/{player_display_name}")
def remove_player_from_tournament_by_display_name(tournament_id: str, player_display_name: str):
    tournament_data = tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
    if tournament_data is None:
        raise HTTPException(status_code=404, detail="Tournament not found!")

    player_data = players_collection.find_one({"display_name": player_display_name})
    if player_data is None:
        raise HTTPException(status_code=404, detail=f"Player with display name {player_display_name} not found!")

    tournament = Tournament(**tournament_data)
    player = Player(**player_data)

    tournament.removePlayerfromTournament(player)

    tournaments_collection.update_one(
        {"_id": ObjectId(tournament_id)},
        {"$set": {"Players": tournament.get_Players()}}
    )

    return {"message": f"Player {player_display_name} removed from tournament successfully"}

@tournament_router.put("/tournament_remove/{tournament_id}")
def delete_tournament_by_id(tournament_id: str):
    tournament_id_obj = ObjectId(tournament_id)
    result = tournaments_collection.delete_one({"_id": tournament_id_obj})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tournament not found!")
    else:
        return {"message": "Tournament deleted successfully"}

print(view_tournaments())
