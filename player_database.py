import asyncio
from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from player import Player

# Initialize FastAPI app
app = APIRouter()

# MongoDB Atlas connection string
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"
# Replace <username>, <password>, <cluster-url>, and <dbname> with your actual MongoDB Atlas credentials and database name

# Establish connection to MongoDB Atlas
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]

# Pydantic model for player creation
class PlayerBase(BaseModel):
    player: Player

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

# Define a handler for the root URL
@app.get("/")
async def root():
    return {"message": "Welcome to the Tournament Software!"}

# FastAPI route to retrieve a player document from MongoDB then convert it to player object
@app.get("/players/{displayname}")
async def get_player(displayname):
    player_document = db.players.find_one({"displayname": displayname})
    player = document_to_player(player_document)
    # add a .lower function for player and searching since displayname will be unique and case sensitivity won't matter
    if player:
        return player
    else:
        raise HTTPException(status_code=404, detail="Player not found!")
        return {"error": "Player not found"}

# For regular users to register as a Player/create an account.
@app.post("/players")
async def register_player(player_base: PlayerBase):
    player_document = player_to_document(player_base.player)
    # Insert player into database
    db.players.insert_one(player_document)
    return {"message": "Player created and registered."}

# For testing purposes.
@app.get("/players/tourney")
async def tourney_players():
    playerlist = ["Vegito", "Epii", "Kayz", "songbaker",
                  "this_is_stupid", "Tim", "Devin", "Hotshot"]
    players = []
    for player in playerlist:
        player_data = await get_player(player)
        players.append(player_data)
    return players

# For database testing via FastAPI and MongoDB.
async def main():
    player1 = await get_player("Vegito")
    print(player1)

    players = await tourney_players()
    print(players)
    for i in players:
        print(i.displayname)

if __name__ == "__main__":
    asyncio.run(main())

