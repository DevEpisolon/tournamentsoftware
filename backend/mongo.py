from pymongo import MongoClient
from dotenv import load_dotenv, dotenv_values

CLIENT_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"


class MongoDB:
    """Singleton class to connect to MongoDB and return the database object"""

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(MongoDB, cls).__new__(cls)
        return cls.instance

    def getDb(self, database="tournamentSoftware"):
        # '''Return the database that points to tournamentSoftware by default.'''
        return self.client[database]

    def __init__(self) -> None:
        try:
            print("Connecting to MongoDB Atlas...")
            load_dotenv()
            config = dotenv_values(".env")
            # client_string = config["MONGO_CLIENT"]
            print("Connecting to MongoDB Atlas 2...")
            self.client = MongoClient(CLIENT_STRING)
            print(config["MONGO_CLIENT"], self.client)
        except Exception as e:
            print("Error connecting to MongoDB Atlas: ", e)
