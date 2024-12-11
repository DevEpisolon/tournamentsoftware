from fastapi import APIRouter, Depends, HTTPException
from mongo import MongoDB
from pymongo import MongoClient
from objects.match import Match
from utils import format
from database.player_database import *
from database.tournament_database import *
from bson import ObjectId

# Router for match-related endpoints
match_router = APIRouter()



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
match_collection = db["matches"]




class MatchDatabase:
    def __init__(self):
        self.matches = {}

    def get_match(self, matchid):
        match = self.matches.get(matchid)
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        return match

    def create_match(self, match_data: dict):
        match = Match(**match_data) 
        self.matches[match.matchid] = match
        return match

match_db = MatchDatabase()

'''
@match_router.get("/matches/tournament/{tournamentName}")
async def get_matches_by_tournament(tournamentName: int):
    matches = match_collection.find({"tournamentName": tournamentName})
    if not matches:
        raise HTTPException(status_code=404, detail="Matches not found")
    return format(matches)
'''

@match_router.get("/matches/players/{displayname}")
def get_matches_by_player(displayname: str):
    matches = match_collection.find({"players.player_id": displayname})
    if not matches:
        raise HTTPException(status_code=404, detail="Matches not found")
    return format(matches)


@match_router.post("/match")
async def post_match(match: dict):
    match_collection.insert_one(match)
    return "Successfully added match"


@match_router.patch("/matches/{match_id}")
async def update_match(match_id: str, update_fields: dict):
    result = match_collection.find_one_and_update(
        {"matchid": match_id}, {"$set": update_fields}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Match not found")
    return "Successfully updated match"


@match_router.post("/matches/")
async def create_match(match_data: dict):
    print(match_data)
    return match_db.create_match(match_data)


@match_router.get("/matches/{matchid}/")
async def read_match(matchid: int):
    return await match_db.get_match(matchid)

'''
@match_router.put("/match/{matchid}/promote_player/{winner}")
async def promote_player(matchid, displayname):
    match = await get_match(matchid)
    matches = await get_all_matches()
    player = await get_player(displayname)
    for next_match in matches:
        if next_match.get_matchid() == match.matchid + match.winner_next_match_id:
            next_match.add_players(player)
            updated_match = match_to_document(next_match)
            match_collection.replace_one(
                {"matchid": int(next_match.matchid)}, updated_match
            )
            break
'''

@match_router.get("/matches/tournament/{tournamentName}")
async def get_matches_by_tournament(tournamentName):
    matches = []
    match_documents = match_collection.find({"tournamentName": tournamentName})
    for match_document in match_documents:
        match = document_to_match(match_document)
        matches.append(match)
    return matches

@match_router.get("/match/{objectid}")
async def get_match(objectid):
    match_document = match_collection.find_one({"_id": ObjectId(objectid)})
    match = document_to_match(match_document)
    if match:
        return match
    else:
        raise HTTPException(status_code=404, detail=f"Match '{objectid}' not found.")

@match_router.put("/match/{objectid}/promote_player/{winner}")
async def promote_player(objectid, displayname):
    match = await get_match(objectid)
    for player in match.players:
        if player.displayname == displayname:
            match.set_match_winner(player)
            match_collection.update_one({"_id": ObjectId(objectid)}, {"$set": {"match_winner": player_to_document(match.match_winner)}})
        else:
            match.set_match_loser(player)
            match_collection.update_one({"_id": ObjectId(objectid)}, {"$set": {"match_loser": player_to_document(match.match_loser)}})

    matches = await get_matches_by_tournament(match.tournamentName)
    for next_match in matches:
        if next_match.matchid == match.matchid + match.winner_next_match_id:
            next_match.add_players(match.match_winner)
            temp = match_collection.find_one({"$and": [{"matchid": next_match.matchid}, {"tournamentName": match.tournamentName}]})
            # For each document, access the _id
            next_match_object_id = temp["_id"]
            updated_players = []
            for player in next_match.players:
                updated_players.append(player_to_document(player))
            match_collection.update_one({"_id": ObjectId(next_match_object_id)}, {"$set": {"players": updated_players}})
            break
    
    
@match_router.put("/update_match_history/{objectid}")
async def update_match_history(objectid):
    match = await get_match(objectid)
    tourn_info = f"{match.tournamentName} Match {match.matchid}"

    winner = await get_player(match.match_winner["displayname"])
    winner = document_to_player(winner)
    if winner is None:
         return
    else:
        winner_info = {
            tourn_info: 'winner'
        }
        winner.update_match_history(winner_info)
        updated_history = winner.match_history
        players_collection.update_one({"displayname": winner.displayname}, {"$set": {"match_history": updated_history}})

        loser = await get_player(match.match_loser["displayname"])
        loser = document_to_player(loser)
        loser_info = {
            tourn_info: 'loser'
        }
        loser.update_match_history(loser_info)
        updated_history = loser.match_history
        players_collection.update_one({"displayname": loser.displayname}, {"$set": {"match_history": updated_history}})

def match_to_document(match):
    serialized_players = [player_to_document(player) for player in match.players]
    serialized_winner = None
    serialized_loser = None
    if match.match_winner is not None:
        serialized_winner = player_to_document(match.match_winner)
    if match.match_loser is not None:
        serialized_loser = player_to_document(match.match_loser)
    return {
        "matchid": match.matchid,
        "slots": match.slots,
        "match_status": match.match_status,
        "winner_next_match_id": match.winner_next_match_id,
        "previous_match_id": match.previous_match_id,
        "match_winner": serialized_winner,
        "match_loser": serialized_loser,
        "loser_next_match_id": match.loser_next_match_id,
        "start_date": match.start_date,
        "end_date": match.end_date,
        "players": serialized_players,
        "max_rounds": match.max_rounds,
        "num_wins": match.num_wins,
        "round_wins": match.round_wins,
        "round_losses": match.round_losses,
        "round_ties": match.round_ties,
        "startTime": match.startTime,
        "endTime": match.endTime,
        "tournamentName": match.tournamentName,
        "bracket_position": match.bracket_position,
        "tournamentRoundNumber" : match.tournamentRoundNumber,
    }

def document_to_match(match_document):
    players = []
    if match_document is not None:
        players_document = match_document.get("players")
        players = [document_to_player(player_doc) for player_doc in players_document]
    if match_document:
        match = Match(
            matchid=match_document.get("matchid"),
            slots=match_document.get("slots"),
            match_status=match_document.get("match_status"),
            winner_next_match_id=match_document.get("winner_next_match_id"),
            previous_match_id=match_document.get("previous_match_id"),
            match_winner=match_document.get("match_winner"),
            match_loser=match_document.get("match_loser"),
            loser_next_match_id=match_document.get("loser_next_match_id"),
            start_date=match_document.get("start_date"),
            end_date=match_document.get("end_date"),
            players=players,
            max_rounds=match_document.get("max_rounds"),
            num_wins=match_document.get("num_wins"),
            round_wins=match_document.get("round_wins"),
            round_losses=match_document.get("round_losses"),
            round_ties=match_document.get("round_ties"),
            startTime=match_document.get("startTime"),
            endTime=match_document.get("endTime"),
            tournamentName=match_document.get("tournamentName"),
            bracket_position=match_document.get("bracket_position"),
            tournamentRoundNumber=match_document.get("tournamentRoundNumber"),
        )
        return match
    else:
        print("Match not found.")
        return None
