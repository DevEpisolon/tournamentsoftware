import json
from player import Player

# Convert players to dictionary in JSON format
def player_to_document(player):
    return {
        "playername": player.playername,
        "displayname": player.displayname,
        "wins": player.wins,
        "losses": player.losses,
        "ties": player.ties
    }

# To store players
players = []

# Create player instances using  class method
player1 = Player('Shiv', 'Vegito', wins=10, losses=4, ties=3)
player2 = Player('Armando', 'Epii', email="hotshot@gmail.com", wins=8, losses=2, ties=4)
player3 = Player('Alex', 'Kayz')
player4 = Player('Seung', 'songbaker', wins=50, losses=0, ties=0)
player5 = Player('Aadim', 'this_is_stupid', wins=21, losses=9, ties=6)
player6 = Player('Tim', 'Tim', wins=14, losses=8, ties=1)
player7 = Player('DevinAI', 'Devin', wins=10, losses=2, ties=7)
player8 = Player('Mr.Glaze', 'Hotshot', wins=1, losses=20, ties=2)
player9 = Player('TheLord', 'God', wins=1, losses=20, ties=2)

players.append(player1)
players.append(player2)
players.append(player3)
players.append(player4)
players.append(player5)
players.append(player6)
players.append(player7)
players.append(player8)
players.append(player9)

# Convert players to JSON format
players = [player_to_document(player) for player in players]

'''
# Write JSON data to file
with open('players.json', 'w') as f:
    json.dump(players, f, indent=2)
'''