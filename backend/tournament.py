from fastapi import APIRouter

router = APIRouter()

@router.get("/{item_id}")
async def get_tournaments(item_id: int):
    return {"item_id": item_id}