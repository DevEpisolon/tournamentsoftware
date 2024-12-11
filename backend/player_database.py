import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pymongo import MongoClient
from mongo import MongoDB
from objects.player import Player
from urllib3 import request
from utils import format
from firebase_admin import auth as firebase_auth

# from app.firebase_config import cred
from fastapi_app import db, client
from bson.regex import Regex

from auth import verify_token

player_router = APIRouter()


db = client["tournamentsoftware"]
players_collection = db["players"]


@player_router.get("/players/get_playerFirebaseID/{displayname}")
async def verify_firebase_token(displayname: str, id_token: str = Query(...)):
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        return uid
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from e

# Convert player object to player document
def player_to_document(player, firebase_uid):
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
        "current_tournament_ties": player.current_tournament_ties,
        "aboutMe": player.aboutMe,
        "pending_invites": player.pending,
        "friends": player.friends,
        "firebase_uid": firebase_uid
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
            current_tournament_ties=player_document.get("current_tournament_ties"),
            aboutMe=player_document.get("aboutMe"),
            pending_invites=player_document.get("pending_invites"),
            friends=player_document.get("friends"),
        )
        return player
    else:
        print("Player not found.")
        return None

@player_router.get("/players/search")
async def search_players(query: str):
    try:
        # Using a case-insensitive regular expression to find partial matches
        regex = Regex(f".*{query}.*", "i")  # "i" makes the regex case-insensitive
        players = db.players.find({"displayname": regex})
        
        # Convert the players cursor to a list
        players_list = [document_to_player(player).__dict__ for player in players]

        if not players_list:
            raise HTTPException(status_code=404, detail="No players found.")
        
        # Limit search results to 10 players
        return players_list[:10]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@player_router.get("/players/get_player/{displayname}")
async def get_player(displayname: str):
    player_document = db.players.find_one({"displayname": displayname})
    player = document_to_player(player_document)
    if player:
        # Return player object including avatar
        return player
    else:
        raise HTTPException(
            status_code=404, detail=f"Player '{displayname}' not found."
        )


@player_router.get("/player/email/{email}")
async def get_player_by_email(email: str):
    player_document = db.players.find_one({"email": email})
    if player_document:
        return format(player_document)
    else:
        raise HTTPException(
            status_code=404, detail=f"Player with email '{email}' not found."
        )


"""
@player_router.post("/players/sendFriendRequest")
async def send_friendRequest(username):
    player_document = db.players.find_one({"displayname": username})
        if
"""
@player_router.post("/players/sendFriendRequest")
async def send_friendRequest(sender: str, reciever: str):
    player_document = db.players.find_one({"displayname": reciever})
    if player_document:
        player = document_to_player(player_document)
        pending_invites = player.pending_invites or []  # Default to an empty list if None
        pending_invites.append(sender)  # Add the sender to the pending invites list
        db.players.update_one(
            {"displayname": reciever},
            {"$set": {"pending_invites": pending_invites}}
        )
        return {"message": f"Friend request sent to {reciever}"}
    else:
        raise HTTPException(status_code=404, detail="Receiver not found.")



"""For regular users to register as a Player/create an account."""


@player_router.post("/players/register_player")
async def register_player(request: Request,  body: dict):
    # playername = input("Enter name: ")
    # displayname = input("Enter display name: ")

    playername = body.get("playername")
    displayname = body.get("displayname")
    email = body.get("email")

    token = await verify_token(request)
    uid = token["uid"]
    new_player = Player(playername=playername, displayname=displayname, email=email)

    # Convert player to document
    player_document = player_to_document(new_player, firebase_uid=uid)



    # check = input("Add player to database? (Y/N): ")

    cursor = db.players.find_one({"displayname": displayname})

    await firebase_auth.set_custom_user_claims(uid, {
        ''
    })

    if cursor:
        raise HTTPException(status_code=400, detail="Player already exists")


    result = db.players.insert_one(player_document)
    player_id = str(result.inserted_id)  # Convert ObjectId to string

    # Set the player_id as custom claim
    await firebase_auth.set_custom_user_claims(uid, {
        'player_id': player_id
    })

    return "Player created an registered"


@player_router.post("/players/admin_create_player")
async def admin_create_player():
    playername = input("Enter name: ")
    displayname = input("Enter display name: ")
    wins = int(input("Enter wins: "))
    losses = int(input("Enter losses: "))
    ties = int(input("Enter ties: "))

    # new_player = Player(playername=playername, displayname=displayname)

    new_player = Player(
        playername=playername,
        displayname=displayname,
        wins=wins,
        losses=losses,
        ties=ties,
    )

    # Convert player to document
    player_document = player_to_document(new_player)

    check = input("Add player to database? (Y/N): ")

    if check == "Y":
        # Insert player into database
        db.players.insert_one(player_document)

    print("Player created.")


"""Used to update about me"""


@player_router.put("/players/update_about_me/{playername}")
async def update_about_me(playername: str, body: dict):
    new_about_me = body.get("aboutMe")
    if not new_about_me or len(new_about_me) > 25:
        raise HTTPException(
            status_code=400,
            detail="Invalid input: 'aboutMe' must be less than 25 characters.",
        )

    result = db.players.update_one(
        {"playername": playername}, {"$set": {"aboutMe": new_about_me}}
    )

    if result.modified_count == 1:
        return {"message": f"Player '{playername}' updated successfully."}
    else:
        raise HTTPException(status_code=404, detail=f"Player '{playername}' not found.")


"""For removing a player from the database."""


@player_router.delete("/players/delete_player/{displayname}")
async def delete_player(displayname: str):
    # Attempt to delete the player from the database
    player = db.players.delete_one({"displayname": displayname})

    # Check if the player was found and deleted
    if player.deleted_count == 1:
        return {"message": f"Player '{displayname}' deleted successfully."}
    else:
        # Player not found in the database
        raise HTTPException(
            status_code=404, detail=f"Player '{displayname}' not found."
        )


"""For updating player stats after tourney."""


def update_tourney_results(round_wins, round_losses, round_ties, tourney_list):
    for player in tourney_list:
        if round_wins.get(player.displayname) != None:
            updated_wins = player.get_wins() + round_wins.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname}, {"$set": {"wins": updated_wins}}
            )
        if round_losses.get(player.displayname) != None:
            updated_losses = player.get_losses() + round_losses.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname},
                {"$set": {"losses": updated_losses}},
            )
        if round_ties.get(player.displayname) != None:
            updated_ties = player.get_ties() + round_ties.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname}, {"$set": {"ties": updated_ties}}
            )
        else:
            continue


"""For updating a single player's stats.."""


"""Currently for testing purposes. Players will be able to add
themselves to the tourney list, playerlist, which will then be used by this function"""


@player_router.get("/players/tourney_players")
async def tourney_players():
    playerlist = [
        "Vegito",
        "Epii",
        "Kayz",
        "songbaker",
        "this_is_stupid",
        "Tim",
        "Devin",
        "Hotshot",
    ]

    players = []
    for player in playerlist:
        player_data = await get_player(player)
        players.append(player_data)

    return players


# Define a route to fetch all players from the database
@player_router.get("/players/all")
async def grab_ALLplayers():
    players_data = list(db.players.find({}))  # Fetch all players from the collection
    players = [
        document_to_player(player_data) for player_data in players_data
    ]  # Convert player documents to Player objects
    return players


# Searches players and with 2 letters or more as input
@player_router.get("/api/players/search")
async def search_players(term: str = Query(..., min_length=1)):
    """
    Search for players whose displayname contains the search term (case-insensitive)
    """
    # Create a case-insensitive regex pattern
    pattern = {"$regex": f".*{term}.*", "$options": "i"}

    # Search in the players collection
    cursor = db.players.find({"displayname": pattern})

    # Convert cursor to list of players
    players = []
    async for player in cursor:
        players.append(Player(**player))

    return players


"""For database testing via FastAPI and MongoDB."""


async def main():
    all_players = await grab_ALLplayers()
    for i in all_players:
        print(i.displayname)

    player1 = await get_player("Vegito")
    print(player1)

    players = await tourney_players()
    print(players)
    for i in players:
        print(i.displayname)


if __name__ == "__main__":
    asyncio.run(main())
