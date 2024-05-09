from fastapi import HTTPException, APIRouter
from Match import Match  # Import the Match class


# Router for match-related endpoints
match_router = APIRouter()

class MatchDatabase:
    def __init__(self):
        self.matches = {}

    def get_match(self, matchid):
        match = self.matches.get(matchid)
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        return match

    def create_match(self, match_data: dict):
        match = Match(**match_data)
        self.matches[match.matchid] = match
        return match

    def promote_player(self, matchid, player_id):
        match = self.get_match(matchid)
        return match.promote_player(player_id)

match_db = MatchDatabase()

@match_router.post("/matches/")
async def create_match(match_data: dict):
    return match_db.create_match(match_data)

@match_router.get("/matches/{matchid}/")
async def read_match(matchid: int):
    return match_db.get_match(matchid)

@match_router.put("/matches/{matchid}/promote/{player_id}/")
async def promote_player(matchid: int, player_id: str):
    return match_db.promote_player(matchid, player_id)

