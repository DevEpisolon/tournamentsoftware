from tournament import Tournament
from database import tournament_collection
from fastapi import APIRouter, HTTPException, status
from player_database import *
from match_database import *

tournament_router = APIRouter()


def tournament_to_document(tournament):

    serialized_players = [player_to_document(player) for player in tournament.Players]
    serialized_matches = [match_to_document(match) for match in tournament.matches]
    return {
        "tournament_name": tournament.tournamentName,
        "tournament_id": tournament.tournamentId,
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
            tournamentId=tournament_document.get("tournament_id"),
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


@tournament_router.get("/tournament/{tournament_id}")
async def get_tournament(tournament_name):
    tournament_document = tournament_collection.find_one({"tournament_name": tournament_name})
    tournament = document_to_tournament(tournament_document)
    if tournament:
        return tournament
    else:
        raise HTTPException(status_code=404, detail=f"Match '{tournament_name}' not found.")


@tournament_router.post("/create_tournament")
async def create_tournament():
    tournament_name = input("Enter a tournament name: ")
    tournament_id = int(input("Enter a tournament id: "))
    slot_count = 8
    max_rounds_per_match = 3
    new_tournament = Tournament(
        tournamentName=tournament_name,
        tournamentId=tournament_id,
        STATUS=None,
        STARTDATE=None,
        ENDDATE=None,
        createdAt=None,
        updatedAt=None,
        MaxSlotsCount=slot_count,
        TournamentType=None,
        TeamBoolean=None,
        AllotedMatchTime=None,
        tournamentWinner=None,
        droppedPlayers=None,
        max_rounds=max_rounds_per_match
    )
    players = await get_all_players()
    new_tournament.Players = players
    tournament_document = tournament_to_document(new_tournament)
    tournament_collection.insert_one(tournament_document)


@tournament_router.put("/create_matches")
async def create_matches(tournament_name):
    tournament = await get_tournament(tournament_name)
    tournament.createMatches()
    updated_tournament = tournament_to_document(tournament)
    tournament_collection.replace_one({"tournament_name": tournament_name}, updated_tournament)
    for match in tournament.matches:
        await create_match(match.matchid, match.slots, match.max_rounds, match.tournamentName, match.players, match.winner_next_match_id)
