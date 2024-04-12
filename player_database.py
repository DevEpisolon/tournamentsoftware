import asyncio
from fastapi import FastAPI
from pymongo import MongoClient
from player import Player

# Initialize FastAPI app
app = FastAPI()

# MongoDB Atlas connection string
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"
# Replace <username>, <password>, <cluster-url>, and <dbname> with your actual MongoDB Atlas credentials and database name

# Establish connection to MongoDB Atlas
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]


# Convert the document into a dummy object
def document_to_player(dummy_document):
    if dummy_document:
        player = Player(
            playername=dummy_document.get("playername"),
            displayname=dummy_document.get("displayname"),
            wins=dummy_document.get("wins", 0),
            losses=dummy_document.get("losses", 0),
            ties=dummy_document.get("ties", 0)
        )
        return player
    else:
        print("User not found.")
        return None


# Define a handler for the root URL
@app.get("/")
async def root():
    return {"message": "Welcome to the Tournament Software!"}


# FastAPI route to retrieve a dummy document from MongoDB then convert it into a dummy object
@app.get("/player/{displayname}")
async def get_player(displayname: str):
    player_document = db.dummies.find_one({"displayname": displayname})
    player = document_to_player(player_document)

    if player:
        return player
    else:
        return {"error": "Player not found"}

@app.get("/player/{displayname}")
async def create_player(displayname: str):
    username = input("Enter username:")

async def main():
    player1 = await get_player("Vegito")


if __name__ == "__main__":
    asyncio.run(main())

# http://127.0.0.1:8000/dummy/Vegito
