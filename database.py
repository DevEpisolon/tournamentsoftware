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
def document_to_dummy(dummy_document):
    if dummy_document:
        dummy = Player.create_dummy(
            playername=dummy_document.get("playername"),
            displayname=dummy_document.get("displayname"),
            wins=dummy_document.get("wins", 0),
            losses=dummy_document.get("losses", 0),
            ties=dummy_document.get("ties", 0)
        )
        print(dummy)
        return dummy
    else:
        print("User not found.")
        return None


# Define a handler for the root URL
@app.get("/")
async def root():
    return {"message": "Welcome to the Tournament Software!"}


# FastAPI route to retrieve a dummy document from MongoDB then convert it into a dummy object
@app.get("/dummy/{displayname}")
async def get_dummy(displayname: str):
    print("Step 2")
    dummy_document = db.dummies.find_one({"displayname": displayname})
    print("Step 3")
    dummy = document_to_dummy(dummy_document)
    print("Step 4")

    if dummy:
        return dummy
    else:
        return {"error": "Dummy not found"}

async def main():
    print("Step 1")
    dummy1 = await get_dummy("Vegito")
    print("Finish")


if __name__ == "__main__":
    asyncio.run(main())

# http://127.0.0.1:8000/dummy/Vegito
