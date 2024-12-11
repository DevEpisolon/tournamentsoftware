import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query, Body, Request
from objects.player import Player
from firebase_admin import auth as firebase_auth
from bson.regex import Regex
from auth import verify_token
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from objects.player import Player
import firebase_admin
from firebase_admin import credentials, auth


player_router = APIRouter()


# Load environment variables from .env file
load_dotenv()

# Get the MongoDB connection string from the environment variable
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_URI")
if not MONGODB_CONNECTION_STRING:
    raise ValueError("MONGODB_URI is not set in the environment")

# Initialize MongoDB client
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]
players_collection = db["players"]


# Modified to inject db dynamically
@player_router.post("/players/test_insert")
async def test_insert_player():
    test_player = {
        "playername": "TestPlayer",
        "displayname": "TestDisplay",
        "uniqueid": "test123",
        "email": "test@example.com",
        "avatar": None,
        "join_date": None,
        "wins": 0,
        "losses": 0,
        "ties": 0,
        "wlratio": 0,
        "winstreaks": [],
        "match_history": [],
        "current_tournament_wins": 0,
        "current_tournament_losses": 0,
        "current_tournament_ties": 0,
        "aboutMe": "This is a test player.",
        "pending_invites": [],
        "friends": [],
        "firebase_uid": "testFirebaseUID",
    }

    try:
        # Insert the test player into the "players" collection
        result = db["players"].insert_one(test_player)
        inserted_id = str(result.inserted_id)  # Convert ObjectId to string
        return {
            "message": "Test player inserted successfully.",
            "inserted_id": inserted_id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inserting test player: {e}")


async def verify_token(request: Request):
    token = request.headers.get("Authorization").split("Bearer ")[-1]  # Extract token
    decoded_token = auth.verify_id_token(token)
    return decoded_token


@player_router.get("/players/get_playerFirebaseID/{displayname}")
async def verify_firebase_token(displayname: str, id_token: str = Query(...)):
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token["firebase_uid"]
        return uid
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from e


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
        "current_tournament_ties": player.current_tournament_ties,
        "aboutMe": player.aboutMe,
        "pending_invites": player.pending_invites,
        "friends": player.friends,
        "firebase_uid": player.firebase_uid,
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
            firebase_uid=player_document.get("firebase_uid"),
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
        return player.__dict__
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


@player_router.post("/players/sendFriendRequest")
async def send_friendRequest(sender: str, reciever: str):
    player_document = db.players.find_one({"displayname": reciever})
    if player_document:
        player = document_to_player(player_document)
        pending_invites = (
            player.pending_invites or []
        )  # Default to an empty list if None
        pending_invites.append(sender)  # Add the sender to the pending invites list
        db.players.update_one(
            {"displayname": reciever}, {"$set": {"pending_invites": pending_invites}}
        )
        return {"message": f"Friend request sent to {reciever}"}
    else:
        raise HTTPException(status_code=404, detail="Receiver not found.")


@player_router.post("/players/updateAvatar")
async def update_avatar(displayname: str, avatar: str):
    player_document = db.players.find_one({"displayname": displayname})
    if player_document:
        db.players.update_one(
            {"displayname": displayname}, {"$set": {"avatar": avatar}}
        )
        return {"message": f"Avatar updated for {displayname}"}
    else:
        raise HTTPException(status_code=404, detail="Player not found.")


@player_router.post("/players/register_player")
async def register_player(body: dict):

    playername = body.get("playername")
    displayname = body.get("displayname")
    email = body.get("email")
    firebase_uid = body.get("firebase_uid")

    # Check if the displayname is already taken
    existing_player_by_displayname = db["players"].find_one(
        {"displayname": displayname}
    )
    if existing_player_by_displayname:
        raise HTTPException(status_code=400, detail="Display name is already taken")

    # Insert the player document into the database
    # player_document = player.dict()
    new_player = Player(
        playername=playername,
        displayname=displayname,
        email=email,
        firebase_uid=firebase_uid,
    )
    player_document = player_to_document(new_player)
    result = db.players.insert_one(player_document)

    # Return a success message or player data after insertion
    return {"Recieved"}


@player_router.put("/players/update_about_me/{playername}")
async def update_about_me(playername: str, body: dict):
    new_about_me = body.get("aboutMe")
    if not new_about_me or len(new_about_me) > 25:
        raise HTTPException(
            status_code=400,
            detail="Invalid input: 'aboutMe' must be less than 25 characters.",
        )

    result = db.players.update_one(
        {"playername": playername},
        {"$set": {"aboutMe": new_about_me}},
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail=f"Player '{playername}' not found.")

    return {"message": f"About me for player '{playername}' updated successfully."}


@player_router.put("/players/update_avatar/{playername}")
async def update_avatar(playername: str, body: dict = Body(...)):
    new_avatar = body.get("avatar")
    if (
        not new_avatar or len(new_avatar) > 255
    ):  # Ensure the avatar URL isn't excessively long
        raise HTTPException(
            status_code=400,
            detail="Invalid input: 'avatar' must be a valid URL and less than 255 characters.",
        )

    result = db.players.update_one(
        {"playername": playername}, {"$set": {"avatar": new_avatar}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Player '{playername}' not found.")

    return {"message": "Avatar updated successfully"}


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


def update_tourney_results(round_wins, round_losses, round_ties, tourney_list):
    for player in tourney_list:
        if round_wins.get(player.displayname) is not None:
            updated_wins = player.get_wins() + round_wins.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname}, {"$set": {"wins": updated_wins}}
            )
        if round_losses.get(player.displayname) is not None:
            updated_losses = player.get_losses() + round_losses.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname},
                {"$set": {"losses": updated_losses}},
            )
        if round_ties.get(player.displayname) is not None:
            updated_ties = player.get_ties() + round_ties.get(player.displayname)
            players_collection.update_one(
                {"displayname": player.displayname}, {"$set": {"ties": updated_ties}}
            )
        else:
            continue


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
