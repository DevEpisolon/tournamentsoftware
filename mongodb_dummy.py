from pymongo import MongoClient
from player import Player

# Establish connection to MongoDB
client = MongoClient("mongodb://localhost:27017")
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

# Retrieve a dummy document from MongoDB then convert it into a dummy object
dummy1 = db.dummies.find_one({"displayname": "Vegito"})
dummy1 = document_to_dummy(dummy1)

dummy2 = db.dummies.find_one({"displayname": "Epii"})
dummy2 = document_to_dummy(dummy2)

dummy3 = db.dummies.find_one({"displayname": "Kayz"})
dummy3 = document_to_dummy(dummy3)

dummy4 = db.dummies.find_one({"displayname": "songbaker"})
dummy4 = document_to_dummy(dummy4)

dummy5 = db.dummies.find_one({"displayname": "this_is_stupid"})
dummy5 = document_to_dummy(dummy5)

dummy6 = db.dummies.find_one({"displayname": "Tim"})
dummy6 = document_to_dummy(dummy6)

dummy7 = db.dummies.find_one({"displayname": "applepie_Ron"})
dummy7 = document_to_dummy(dummy7)

dummy8 = db.dummies.find_one({"displayname": "pptLover"})
dummy8 = document_to_dummy(dummy8)