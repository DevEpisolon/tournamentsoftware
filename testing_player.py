import json
from player import Player

# Convert dummies to dictionary in JSON format
def dummy_json_conversion(dummy):
    return {
        "playername": dummy.playername,
        "displayname": dummy.displayname,
        "wins": dummy.wins,
        "losses": dummy.losses,
        "ties": dummy.ties
    }

# To store dummies
dummies = []

# Create dummy instances using create_dummy class method
dummies.append(Player.create_dummy('Shiv', 'Vegito', wins=10, losses=4, ties=3))
dummies.append(Player.create_dummy('Armando', 'Epii', wins=8, losses=2, ties=4))
dummies.append(Player.create_dummy('Alex', 'Kayz'))
dummies.append(Player.create_dummy('Seung', 'songbaker', wins=50, losses=0, ties=0))
dummies.append(Player.create_dummy('Aadim', 'this_is_stupid', wins=21, losses=9, ties=6))
dummies.append(Player.create_dummy('Tim', 'Tim', wins=14, losses=8, ties=1))
dummies.append(Player.create_dummy('Ronald McDonald', 'applepie_Ron', wins=10, losses=2, ties=7))
dummies.append(Player.create_dummy('Powerpoint', 'pptLover', wins=1, losses=20, ties=2))

# Convert dummies to JSON format
dummies = [dummy_json_conversion(dummy) for dummy in dummies]

# Write JSON data to file
with open('dummies.json', 'w') as f:
    json.dump(dummies, f, indent=2)