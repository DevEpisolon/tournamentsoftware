import asyncio
from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from mongo import MongoDB
from player import Player
from utils import format

# Initialize FastAPI app
player_router = APIRouter()

# # MongoDB Atlas connection string
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"
# # Replace <username>, <password>, <cluster-url>, and <dbname> with your actual MongoDB Atlas credentials and database name

# # Establish connection to MongoDB Atlas
client = MongoClient(MONGODB_CONNECTION_STRING)
#client = MongoDB().getDb()
db = client["tournamentsoftware"]
players_collection = db["players"]


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


@player_router.get("/players/get_player/{displayname}")
async def get_player(displayname: str):
    player_document = db.players.find_one({"displayname": displayname})
    player = document_to_player(player_document)
    if player:
        # Return player object including avatar
        return player.__dict__
    else:
        raise HTTPException(status_code=404, detail=f"Player '{displayname}' not found.")


@player_router.get("/player/email/{email}")
async def get_player_by_email(email: str):
    player_document = db.players.find_one({"email": email})
    if player_document:
        return format(player_document)
    else:
        raise HTTPException(status_code=404, detail=f"Player with email '{email}' not found.")


'''For regular users to register as a Player/create an account.'''
@player_router.post("/players/register_player")
async def register_player(body: dict):
    # playername = input("Enter name: ")
    # displayname = input("Enter display name: ")

    playername = body.get("playername")
    displayname = body.get("displayname")   
    email = body.get("email")

    new_player = Player(playername=playername, displayname=displayname, email=email)

    # Convert player to document
    player_document = player_to_document(new_player)

    # check = input("Add player to database? (Y/N): ")

    cursor = db.players.find_one({"displayname": displayname})

    if cursor: 
        raise HTTPException(status_code=400, detail="Player already exists")

    # if check == "Y":
    #     # Insert player into database
    db.players.insert_one(player_document)

    return "Player created an registered"

    print("Player created and registered.")


@player_router.post("/players/admin_create_player")
async def admin_create_player():
    playername = input("Enter name: ")
    displayname = input("Enter display name: ")
    wins = int(input("Enter wins: "))
    losses = int(input("Enter losses: "))
    ties = int(input("Enter ties: "))

    # new_player = Player(playername=playername, displayname=displayname)

    new_player = Player(playername=playername, displayname=displayname, wins=wins, losses=losses, ties=ties)

    # Convert player to document
    player_document = player_to_document(new_player)

    check = input("Add player to database? (Y/N): ")

    if check == "Y":
        # Insert player into database
        db.players.insert_one(player_document)

    print("Player created.")

'''For removing a player from the database.'''
@player_router.delete("/players/delete_player/{displayname}")
async def delete_player(displayname: str):
    # Attempt to delete the player from the database
    player = db.players.delete_one({"displayname": displayname})

    # Check if the player was found and deleted
    if player.deleted_count == 1:
        return {"message": f"Player '{displayname}' deleted successfully."}
    else:
        # Player not found in the database
        raise HTTPException(status_code=404, detail=f"Player '{displayname}' not found.")

'''For updating player stats after tourney.'''
def update_tourney_results(round_wins, round_losses, round_ties, tourney_list):
    for player in tourney_list:
        if round_wins.get(player.displayname) != None:
            updated_wins = player.get_wins() + round_wins.get(player.displayname)
            players_collection.update_one({"displayname": player.displayname}, {"$set": {"wins": updated_wins}})
        if round_losses.get(player.displayname) != None:
            updated_losses = player.get_losses() + round_losses.get(player.displayname)
            players_collection.update_one({"displayname": player.displayname}, {"$set": {"losses": updated_losses}})
        if round_ties.get(player.displayname) != None:
            updated_ties = player.get_ties() + round_ties.get(player.displayname)
            players_collection.update_one({"displayname": player.displayname}, {"$set": {"ties": updated_ties}})
        else:
            continue

'''For updating a single player's stats..'''


'''Currently for testing purposes. Players will be able to add
themselves to the tourney list, playerlist, which will then be used by this function'''
@player_router.get("/players/tourney_players")
async def tourney_players():
    playerlist = ["Vegito", "Epii", "Kayz", "songbaker",
                  "this_is_stupid", "Tim", "Devin", "Hotshot"]

    players = []
    for player in playerlist:
        player_data = await get_player(player)
        players.append(player_data)

    return players


# Define a route to fetch all players from the database
@player_router.get("/players/all")
async def grab_ALLplayers():
    players_data = list(db.players.find({}))  # Fetch all players from the collection
    players = [document_to_player(player_data) for player_data in players_data]  # Convert player documents to Player objects
    return players


'''For database testing via FastAPI and MongoDB.'''
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
