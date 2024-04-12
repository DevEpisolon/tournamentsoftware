from fastapi import APIRouter

router = APIRouter()



# Pydantic models
class Player(BaseModel):
    playerName: str
    displayName: str

# Routes
@app.post("/players/")
async def create_player(player: Player):
    player_dict = player.dict()
    players_collection.insert_one(player_dict)
    return player

@app.delete("/players/{display_name}")
async def delete_player(display_name: str):
    result = players_collection.delete_one({"displayName": display_name})
    if result.deleted_count == 0:
        return {"message": "Player not found"}
    return {"message": "Player deleted successfully"}






