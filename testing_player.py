import json
from player import Player

# Convert dummies to dictionary in JSON format
def dummy_to_document(dummy):
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
dummy1 = Player.create_dummy('Shiv', 'Vegito', wins=10, losses=4, ties=3)
dummy2 = Player.create_dummy('Armando', 'Epii', wins=8, losses=2, ties=4)
dummy3 = Player.create_dummy('Alex', 'Kayz')
dummy4 = Player.create_dummy('Seung', 'songbaker', wins=50, losses=0, ties=0)
dummy5 = Player.create_dummy('Aadim', 'this_is_stupid', wins=21, losses=9, ties=6)
dummy6 = Player.create_dummy('Tim', 'Tim', wins=14, losses=8, ties=1)
dummy7 = Player.create_dummy('Ronald McDonald', 'applepie_Ron', wins=10, losses=2, ties=7)
dummy8 = Player.create_dummy('Powerpoint', 'pptLover', wins=1, losses=20, ties=2)

dummies.append(dummy1)
dummies.append(dummy2)
dummies.append(dummy3)
dummies.append(dummy4)
dummies.append(dummy5)
dummies.append(dummy6)
dummies.append(dummy7)
dummies.append(dummy8)

# Convert dummies to JSON format
dummies = [dummy_to_document(dummy) for dummy in dummies]

# Write JSON data to file
with open('dummies.json', 'w') as f:
    json.dump(dummies, f, indent=2)