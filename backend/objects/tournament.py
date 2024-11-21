from datetime import datetime
from objects.match import Match
import math
class Tournament:
    def __init__(self, tournamentName, STATUS, STARTDATE, ENDDATE, createdAt, updatedAt, max_rounds,
                 maxSlotsPerMatch, MaxSlotsCount, matches=None, TournamentType=None, TeamBoolean=None, AllotedMatchTime=None,
                 Players=None, tournamentWinner=None, droppedPlayers=None, wins_dict=None, losses_dict=None,
                 ties_dict=None,rounds=None):
      
        self.tournamentName = tournamentName
        self.STATUS = STATUS
        self.STARTDATE = STARTDATE
        self.ENDDATE = ENDDATE
        self.createdAt = createdAt if createdAt else datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.updatedAt = updatedAt
        self.matches = matches if matches else []
        #overall slots in the whole tournament
        self.MaxSlotsCount = MaxSlotsCount
        self.TournamentType = TournamentType
        self.TeamBoolean = TeamBoolean
        self.AllotedMatchTime = AllotedMatchTime
        self.Players = Players if Players else []
        self.tournamentWinner = tournamentWinner
        self.droppedPlayers = droppedPlayers if droppedPlayers else []
        self.maxSlotsPerMatch = maxSlotsPerMatch if maxSlotsPerMatch else 2
        self.max_rounds = max_rounds
        self.wins_dict = wins_dict if wins_dict else {}
        self.losses_dict = losses_dict if losses_dict else {}
        self.ties_dict = ties_dict if ties_dict else {}
        self.rounds = math.log2(len(Players) + 1)


    # Getter and setter methods for each attribute
    def get_tournamentName(self):
        return self.tournamentName

    def set_tournamentName(self, tournamentName):
        self.tournamentName = tournamentName

    def get_STATUS(self):
        if (self.STATUS == 0 ):
            return "In Progress"
        elif(self.STATUS == 1):
            return "Not Started"
        elif(self.STATUS == 2):
            return "Finished"
    #gets set from 0-2
    def set_STATUS(self, STATUS):
        self.STATUS = STATUS

    def get_STARTDATE(self):
        return self.STARTDATE

    def set_STARTDATE(self, STARTDATE):
        self.STARTDATE = STARTDATE

    def get_ENDDATE(self):
        return self.ENDDATE

    def set_ENDDATE(self, ENDDATE):
        self.ENDDATE = ENDDATE

    def get_createdAt(self):
        return self.createdAt
    
    def set_MaxSlotsPerMatch(self, count):
        self.maxSlotsPerMatch = count
    
    def get_MaxSlotsPerMatch(self):
        return self.maxSlotsPerMatch
    
    def set_createdAt(self, createdAt):
        self.createdAt = createdAt

    def get_updatedAt(self):
        return self.updatedAt

    def set_updatedAt(self, updatedAt):
        self.updatedAt = updatedAt

    def get_Matches(self):
        return self.matches

    def set_Matches(self, matches):
        self.matches = matches

    def get_MaxSlotsCount(self):
        return self.MaxSlotsCount

    def set_MaxSlotsCount(self, MaxSlotsCount):
        self.MaxSlotsCount = MaxSlotsCount

    def get_TournamentType(self):
        return self.TournamentType

    def set_TournamentType(self, TournamentType):
        self.TournamentType = TournamentType

    def get_TeamBoolean(self):
        return self.TeamBoolean

    def set_TeamBoolean(self, TeamBoolean):
        self.TeamBoolean = TeamBoolean

    def get_AllotedMatchTime(self):
        return self.AllotedMatchTime

    def set_AllotedMatchTime(self, AllotedMatchTime):
        self.AllotedMatchTime = AllotedMatchTime
    
    def get_Players(self):
        return self.Players

    def set_Players(self, Players):
        self.Players = Players
    
    def get_tournamentWinner(self):
        return self.tournamentWinner

    def set_tournamentWinner(self,Player):
        self.tournamentWinner = Player
    
    def set_rounds(self,rounds):
        self.rounds = rounds

    def get_rounds(self):
        return self.rounds

    
#Functions
    '''
    Add a singulaur player to the tournament
    player = player to add to tournament
    '''
    def addPlayertoTournament(self,Player):
        self.Players.append(Player)

    def allMatchesInRoundFinished(self,roundNumber):
        for x in self.getMatches:
            pass
            #need to check roundNumber in match 

    '''
    Remove a player from the tournament
    player = player to remove
    '''
    def removePlayerfromTournament(self,Player):
        self.Players.remove(Player)
        self.droppedPlayers.append(Player)
    '''
    To view the matches in the tournament
    tournament = tournament you would like to view
    '''
    def viewMatchesinTournament(self):
        for x in self.get_Matches():
            print(f"{x}")
    
    '''
    To get the int of the players in the tournament
    '''
    def getPlayerCount(self):
        return len(self.Players)
    '''
    To get a certian match in tournament
    matches is all the matches in tournament
    matchid is the match id
    '''
    def get_MatchbyID(self, match_id):
       # print([m for m in self.get_Matches()])
        for match in self.get_Matches():
            #print(f"Current matchID: {match.get_matchid()} Finding: {match_id}")
            if int(match.get_matchid()) == int(match_id):
                return match
        return None
    '''
    To create the matches in the tournaemnt
    Needs to be flexible based on tournamentType : Single Double Pairing
    Needs to create the necessary matches beforehand and route them like a web or a tree
    Need rounds so all the first matches finished then we can promote once everyone is finished
    Need async calls incase they close out the tournament and restart it so nothing is stored in allocated cache for recall memory
    Need to make less calls and just place the players without much checking/hardcoding


    '''
    def createMatches(self):
        matches = []
        matchCount = self.getPlayerCount() - 1
        tempPlayers = self.get_Players().copy()  
        #print(f"temp players: {tempPlayers}")
        count = 0
        nextCountID = self.getPlayerCount()/2
        playersInMatch = []
        #print(f"Max slots count: {self.get_MaxSlotsCount()}")
        for i in range(1,matchCount+1):
            #print(f"Count: {count}")
            count +=1

            #check count
            if(count == 2):
                #print("Came through the 2 end")
                if (len(tempPlayers)> 0):
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    #print("The Players in the match")
                    #print([p.get_displayname() for p in playersInMatch])
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=0, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=playersInMatch,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), endTime=None)
                    #print(m)
                else:
                    #print("Detected no players in 2 count")
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=1, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=None,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=None, endTime=None)
                count = 0
            #Uneven count
            else:
                #print("Came through the other end!")
                if (len(tempPlayers) >0):
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    #print("The players in the match")
                    #print([p.get_displayname() for p in playersInMatch])
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=0, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=playersInMatch,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime= datetime.now().strftime("%Y-%m-%d %H:%M:%S"), endTime=None)
                    #print(m)
                else:
                    #print("Detected no players in other")
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=1, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=None,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=None, endTime=None)
                nextCountID -=1

            #Empty the players list to add other players
            playersInMatch = []
            matches.append(m)
        self.set_Matches(matches)
    '''Updated create match function under development'''
    def __CreateMatches(self):
        tempPlayers = self.getPlayers().copy()
        self.set_rounds(math.log2(len(tempPlayers)))
        matchCount = self.getPlayerCount() - 1
        totalMatches = math.log2(len(players)  
        i = 0 
        matches = []
            for x in range(get_rounds()):
                for _ in range(self.getPlayerCount() -1):
                    i =+1 
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=1, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=None,
                       previous_match_id=None, match_winner=None,
                      match_loser=None, start_date=None, end_date=None,
                      startTime=None, endTime=None, roundNumber = x)
                    matches.append(m)

            self.set_matches(matches)

    # call it when tournament ended so it can fetch players' wins, losses, and ties
    def update_dict(self):
        for match in self.get_Matches():
            for player in match.get_players():
                if match.round_wins.get(player.displayname) is not None:
                    self.wins_dict[player.displayname] = self.wins_dict.get(player.displayname, 0) + match.round_wins.get(player.displayname)
                if match.round_losses.get(player.displayname) is not None:
                    self.losses_dict[player.displayname] = self.losses_dict.get(player.displayname, 0) + match.round_losses.get(player.displayname)
                if match.round_ties.get(player.displayname) is not None:
                    self.ties_dict[player.displayname] = self.ties_dict.get(player.displayname, 0) + match.round_ties.get(player.displayname)

    
    # Helper function to print tournament details
    def print_details(self):
        print("Tournament Name:", self.tournamentName)
        print("Status:", self.STATUS)
        print("Start Date:", self.STARTDATE)
        print("End Date:", self.ENDDATE)
        print("Created At:", self.createdAt)
        print("Updated At:", self.updatedAt)
        print("Matches:", self.matches)
        print("Max Slots Count:", self.MaxSlotsCount)
        print("Tournament Type:", self.TournamentType)
        print("Team Boolean:", self.TeamBoolean)
        print("Alloted Match Time:", self.AllotedMatchTime)
        print("Players:", self.Players)
  
    def to_dict(self):
        return {
            "tournamentName": self.tournamentName,
            "STATUS": self.STATUS,
            "STARTDATE": self.STARTDATE,
            "ENDDATE": self.ENDDATE,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "max_rounds": self.max_rounds,
            "maxSlotsPerMatch": self.maxSlotsPerMatch,
            "MaxSlotsCount": self.MaxSlotsCount,
            "TournamentType": self.TournamentType,
            "TeamBoolean": self.TeamBoolean,
            "AllotedMatchTime": self.AllotedMatchTime,
            "Players": self.Players,
            "tournamentWinner": self.tournamentWinner,
            "droppedPlayers": self.droppedPlayers,
            "wins_dict": self.wins_dict,
            "losses_dict": self.losses_dict,
            "ties_dict": self.ties_dict,
            "rounds": self.rounds
            }
