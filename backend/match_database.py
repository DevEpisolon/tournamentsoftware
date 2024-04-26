from match import Match
from database import match_collection
from fastapi import APIRouter, HTTPException, status
import asyncio
from player_database import*

match_router = APIRouter()

def match_to_document(match):
    serialized_players = [player_to_document(player) for player in match.players]
    return {
        "matchid": match.matchid,
        "slots": match.slots,
        "match_status": match.match_status,
        "winner_next_match_id": match.winner_next_match_id,
        "previous_match_id": match.previous_match_id,
        "match_winner": match.match_winner,
        "match_loser": match.match_loser,
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
            startTime=match_document.get("start_time"),
            endTime=match_document.get("end_time"),
            tournamentName=match_document.get("tournament_name"),
            round_wins=match_document.get("round_wins"),
            round_losses=match_document.get("round_losses"),
            round_ties=match_document.get("round_ties")
        )
        return match
    else:
        print("Match not found.")
        return None


@match_router.get("/match/{matchid}")
async def get_match(matchid):
    match_document = match_collection.find_one({"matchid": int(matchid)})
    match = document_to_match(match_document)
    if match:
        return match
    else:
        raise HTTPException(status_code=404, detail=f"Match '{matchid}' not found.")


@match_router.get("/matches")
async def get_all_matches():
    matches = []
    match_documents = match_collection.find({})
    for match_document in match_documents:
        match = document_to_match(match_document)
        matches.append(match)

    return matches


@match_router.post("/create_match")
async def create_match():
    matchid = int(input("Enter matchid: "))
    slots = int(input("Enter number of slots: "))
    max_rounds = int(input("Enter max number of rounds: "))
    winner_next_match = int(input("Enter winner's next matchid: "))
    new_match = Match(matchid=matchid, slots=slots, max_rounds=max_rounds, winner_next_match_id=winner_next_match)
    match_document = match_to_document(new_match)
    match_collection.insert_one(match_document)


@match_router.put("/match/{matchid}/add_player/{displayname")
async def add_player(matchid, displayname):
    match = await get_match(matchid)
    player = await get_player(displayname)
    if match.slots < len(match.players) + 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Match is already full. Cannot add more players.")
    match.players.append(player)
    updated_match = match_to_document(match)
    match_collection.replace_one({"matchid": int(matchid)}, updated_match)


@match_router.put("/match/{matchid}/update_round/{winner}")
async def update_round(matchid, displayname):
    match = await get_match(matchid)
    match.match_status = "in progress"
    for player in match.players:
        if player.displayname != displayname:
            match.round_losses[player.displayname] = match.round_losses.get(player.displayname, 0) + 1
            match.players[match.players.index(player)].increase_losses()
            match.players[match.players.index(player)].set_wlratio(player.wins, player.losses)
            loser = await get_player(player.displayname)
            updated_loss = loser.losses + 1
            updated_wl = loser.wins if updated_loss == 0 else loser.wins / updated_loss
            player_collection.update_one({"displayname": loser.displayname}, {"$set": {"losses": updated_loss, "wlratio": updated_wl}})
        else:
            match.round_wins[player.displayname] = match.round_wins.get(player.displayname, 0) + 1
            match.players[match.players.index(player)].increase_wins()
            match.players[match.players.index(player)].set_wlratio(player.wins, player.losses)
            winner = await get_player(player.displayname)
            updated_win = winner.wins + 1
            updated_wl = updated_win if winner.losses == 0 else updated_win / winner.losses
            player_collection.update_one({"displayname": winner.displayname}, {"$set": {"wins": updated_win, "wlratio": updated_wl}})
    updated_match = match_to_document(match)
    match_collection.replace_one({"matchid": int(matchid)}, updated_match)

    matches = await get_all_matches()
    if match.round_wins[displayname] >= match.num_wins:
        match_collection.update_one({"matchid": int(matchid)}, {"$set": {"match_status": "completed"}})
        for next_match in matches:
            if next_match.matchid == match.winner_next_match_id:
                await add_player(match.winner_next_match_id, displayname)
                print(f"{displayname} won this match and is moving to match {match.winner_next_match_id}.")

