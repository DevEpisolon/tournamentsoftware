from player import Player
from database import player_collection
from fastapi import APIRouter, HTTPException

player_router = APIRouter()

# Convert player object to player document
def player_to_document(player):
    return {
        "playername": player.playername,
        "displayname": player.displayname,
        "uniqueid": player.uniqueid,
        "email": player.email,
        "avatar": player.avatar,
        "join_date": player.join_date,
        "wins": player.wins,
        "losses": player.losses,
        "ties": player.ties,
        "wlratio": player.wlratio,
        "winstreaks": player.winstreaks,
        "match_history": player.match_history,
        "current_tournament_wins": player.current_tournament_wins,
        "current_tournament_losses": player.current_tournament_losses,
        "current_tournament_ties": player.current_tournament_ties
    }


# Convert player document to player object
def document_to_player(player_document):
    if player_document:
        player = Player(
            playername=player_document.get("playername"),
            displayname=player_document.get("displayname"),
            uniqueid=player_document.get("uniqueid"),
            email=player_document.get("email"),
            avatar=player_document.get("avatar"),
            join_date=player_document.get("join_date"),
            wins=player_document.get("wins"),
            losses=player_document.get("losses"),
            ties=player_document.get("ties"),
            wlratio=player_document.get("wlratio"),
            winstreaks=player_document.get("winstreaks"),
            match_history=player_document.get("match_history"),
            current_tournament_wins=player_document.get("current_tournament_wins"),
            current_tournament_losses=player_document.get("current_tournament_losses"),
            current_tournament_ties=player_document.get("current_tournament_ties")
        )
        return player
    else:
        print("Player not found.")
        return None


@player_router.get("/players/{displayname}")
async def get_player(displayname):
    player_document = player_collection.find_one({"displayname": displayname})
    player = document_to_player(player_document)
    # add a .lower function for player and searching since displayname will be unique and case sensitivity won't matter
    if player:
        return player
    else:
        raise HTTPException(status_code=404, detail=f"Player '{displayname}' not found.")


@player_router.post("/players")
async def register_player():
    playername = input("Enter name: ")
    displayname = input("Enter display name: ")

    new_player = Player(playername=playername, displayname=displayname)

    # Convert player to document
    player_document = player_to_document(new_player)

    check = input("Add player to database? (Y/N): ")

    if check == "Y":
        # Insert player into database
        player_collection.insert_one(player_document)

    print("Player created and registered.")
