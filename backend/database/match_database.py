from fastapi import APIRouter, Depends, HTTPException
from mongo import MongoDB
from pymongo import MongoClient
from objects.match import Match
from utils import format
from database.player_database import *
from fastapi_app import db, client

# Router for match-related endpoints
match_router = APIRouter()


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


db = client["tournamentsoftware"]
match_collection = db["matches"]

match_db = MatchDatabase()


@match_router.get("/matches/tournament/{tournamentName}")
async def get_matches_by_tournament(tournamentName: int):
    matches = match_collection.find({"tournamentName": tournamentName})
    if not matches:
        raise HTTPException(status_code=404, detail="Matches not found")
    return format(matches)


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


@match_router.get("/matches")
async def get_all_matches():
    matches = []
    match_documents = match_collection.find({})
    for match_document in match_documents:
        match = document_to_match(match_document)
        matches.append(match)
    return matches


@match_router.get("/match/{matchid}")
async def get_match(matchid):
    match_document = match_collection.find_one({"matchid": int(matchid)})
    match = document_to_match(match_document)
    if match:
        return match
    else:
        raise HTTPException(status_code=404, detail=f"Match '{matchid}' not found.")


def match_to_document(match):
    serialized_players = [player for player in match.players]
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
        "start_time": match.startTime,
        "end_time": match.endTime,
        "tournament_name": match.tournamentName,
        "bracket_position": match.bracket_position,
        "round" : match.tournamentRoundNumber,
    }
