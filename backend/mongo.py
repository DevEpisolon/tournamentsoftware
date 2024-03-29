from pymongo import MongoClient
from dotenv import load_dotenv, dotenv_values

class MongoDB():
  '''Singleton class to connect to MongoDB and return the database object'''
  def __new__(cls):
    if not hasattr(cls, 'instance'):
      cls.instance = super(MongoDB, cls).__new__(cls)
    return cls.instance
  def getDb(self, database="FoodTrucks"):
        '''Return the database that points to FoodTrucks by default.'''
        return self.client[database]
  
  def __init__(self) -> None:
    load_dotenv()
    config = dotenv_values(".env")
    client_string = config["MONGO_CLIENT"]
    self.client = MongoClient(client_string)
    print(config["MONGO_CLIENT"], self.client)
