import asyncio
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient

# Initialize FastAPI app
app = FastAPI

# MongoDB Atlas connection string
MONGODB_CONNECTION_STRING = "mongodb+srv://tas32admin:onward508@tournamentsoftware.l9dyjo7.mongodb.net/?retryWrites=true&w=majority&appName=tournamentsoftware"
# Replace <username>, <password>, <cluster-url>, and <dbname> with your actual MongoDB Atlas credentials and database name

# Establish connection to MongoDB Atlas
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["tournamentsoftware"]