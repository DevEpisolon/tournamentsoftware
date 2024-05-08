from pymongo import MongoClient

client = MongoClient("mongodb+srv://seungbaik:qazqaz213@cluster0.9ziumia.mongodb.net/?retryWrites=true&w=majority")

db = client.tournament_software

player_collection = db["player"]
match_collection = db["match"]
tournament_collection = db["tournament"]
