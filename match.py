import time

class Match:
    def __init__(self, matchid, slots, match_status, max_rounds, tournamentName, winner_next_match_id=None, previous_match_id=None,
                 match_winner=None, match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                 players=None, startTime=None, endTime=None):
        self.matchid = matchid
        self.slots = slots
        self.match_status = match_status
        self.winner_next_match_id = winner_next_match_id
        self.previous_match_id = previous_match_id
        self.match_winner = None
        self.match_loser = match_loser
        self.loser_next_match_id = loser_next_match_id
        self.start_date = start_date
        self.end_date = end_date
        self.players = players or []  # Initialize as empty list if not provided
        # best of 3, 5, etc
        self.max_rounds = max_rounds
        # keeps track of the players win
        self.rounds = rounds = {player.get_playername(): 0 for player in self.players}
        self.startTime = startTime
        self.endTime = endTime
        # Should be made with the tournament class so no setters needed!
        self.tournamentName = tournamentName

    # Getters
    def get_matchid(self):
        return self.matchid

    def get_slots(self):
        return self.slots

    def get_match_status(self):
        return self.match_status

    def get_winner_next_match_id(self):
        return self.winner_next_match_id

    def get_previous_match_id(self):
        return self.previous_match_id

    def get_match_winner(self):
        return self.match_winner

    def get_match_loser(self):
        return self.match_loser

    def get_loser_next_match_id(self):
        return self.loser_next_match_id

    def get_start_date(self):
        return self.start_date

    def get_end_date(self):
        return self.end_date

    def get_players(self):
        return self.players

    def get_max_rounds(self):
        return self.max_rounds

    def get_rounds(self):
        return self.rounds

    def get_start_time(self):
        return self.startTime
    
    def get_end_time(self):
        return self.endTime
    
    def get_tournamentName(self):
        return self.tournamentName
    # Setters
    def set_matchid(self, matchid):
        self.matchid = matchid

    def set_slots(self, slots):
        self.slots = slots

    def set_match_status(self, match_status):
        self.match_status = match_status

    def set_winner_next_match_id(self, winner_next_match_id):
        self.winner_next_match_id = winner_next_match_id

    def set_previous_match_id(self, previous_match_id):
        self.previous_match_id = previous_match_id

    def set_match_winner(self, match_winner):
        self.match_winner = match_winner

    def set_match_loser(self, match_loser):
        self.match_loser = match_loser

    def set_loser_next_match_id(self, loser_next_match_id):
        self.loser_next_match_id = loser_next_match_id

    def set_start_date(self, start_date):
        self.start_date = start_date

    def set_end_date(self, end_date):
        self.end_date = end_date

    def set_players(self, players):
        self.players = players

    def set_max_rounds(self, max_rounds):
        self.max_rounds = max_rounds

    def set_rounds(self, rounds):
        self.rounds = rounds

    def set_start_time(self, startTime):
        self.startTime = startTime

    def set_end_time(self, endTime):
        self.endTime = endTime
    
    def add_players(self, player):
        """
        player(Player): player to add

        Adds the player to the match if there are slots available.
        """
        if len(self.players) >= self.slots:
            print("Error: There are too many players.")
        else:
            self.players.append(player)
            self.rounds[player.get_playername()] = 0

   
    def remove_player(self, player):
        """
        player(Player): player to remove

        If the player exists, then remove them.
        """
        if player in self.players:
            self.players.remove(player)
        else:
            print(f"Error: Player {player} is not in the match.")

    """
        Prints every player's name in the match.
    """
    def show_players(self):
        for player in self.players():
            print(player.get_playername)
    
    def update_rounds(self, winner):
        """
        winner(Player): the winner of a round

        If this is a best of 3, then this function will update self.rounds to reflect the outcome.
        """
        if winner.get_playername in self.rounds:
            self.rounds[winner.get_playername()] += 1
        else:
            print(f"Error: {winner.get_playername()} is not a valid player in this match.")

    '''
    def set_round_winner(self, matches):
        
        matches(List[Match]): list of all matches in the tournament
    
        Sets the match_winner and match_loser and updates the player's win/lose.
        If the next_match ID matches with the winner_next_match ID, then add_player into next_match.
        Note: update later for double elimination
        
        for winner in self.get_players():
            if self.rounds[winner.get_playername()] >= 2 and self.max_rounds == 3:
                self.set_match_winner(winner)
                winner.increase_wins()
            elif self.rounds[winner.get_playername()] >= 3 and self.max_rounds == 5:
                self.set_match_winner(winner)
                winner.increase_wins()
            elif self.rounds[winner.get_playername()] >= 1:
                self.set_match_winner(winner)
                winner.increase_wins()
            else:
                self.set_match_loser(winner)
                winner.increase_losses()

        for next_match in matches:
            if next_match.get_matchid() == self.winner_next_match_id:
                next_match.add_players(self.match_winner)
                break
    '''

    def set_round_winner(self, matches, winner):
        if winner.get_playername() not in self.rounds:
            self.rounds[winner.get_playername()] = 0
        else: 
            self.rounds[winner.get_playername()] +=1 
            if self.rounds[winner.get_playername()] >= int(self.max_rounds) -1:
                self.set_match_winner(winner)
                for i in range(len(matches)):
                    if matches[i].get_matchid() == self.matchid + self.winner_next_match_id:
                        matches[i].add_players(self.get_match_winner())
                        self.change_match_status(1)
                        print(f"{self.get_match_winner().get_playername()} won the match and is moving onto match {matches[i].get_matchid()}")
                        break

    def print_standings(self):
        """
        Prints the current round standings.
        """
        for items in self.rounds:
            print(f"{items.key}: {items.value}\n")

    
    def change_match_status(self, status):
        """
        status(int)
    
        Changes the status of the match.
        """
        if status == 1:
            self.set_match_status("completed")
        elif status == 2:
            self.set_match_status("in progress")
        elif status == 3:
            self.set_match_status("inactive")

    
    def start_match(self):
        """
        Uses time library to get the time when the function is called and prints out the time.
        
        Note that self.startTime is an epoch
        """
        self.set_start_time(time.time())
        convertedTime = time.ctime(self.get_start_time())
        print("The Match started at:", convertedTime)

    
    def end_match(self):
        """
        Uses time library to get the time when the function is called and prints out the time

        Note that self.endTime is an epoch
        """
        self.set_end_time(time.time())
        convertedTime = time.ctime(self.get_end_time())
        print("Match ended at:", convertedTime)

    
    def match_timer(self):
        """
        Checks if the match has ended to calculate the match timer.
        If match is in progress then use the current time this function
        has been called.
        """
        if self.get_end_time() is None:
            currentTime = time.time()
            match_timer = currentTime - self.get_start_time()
            print(f"The match timer is {match_timer} seconds")
        else:
            match_timer = self.get_end_time() - self.get_start_time()
            print(f"The match timer is {match_timer} seconds")

    """
    Equivalent to overriding toString in Java/C.
    When print is called on the match object, the output will be MatchID, status, and players participating.
    """
    def __str__(self):
        output = (f"Match ID: {self.get_matchid()} | Next Match ID: {self.get_winner_next_match_id() + self.get_matchid()}"
                  f" | Match Status: {self.get_match_status()}")
        for player in self.players:
            output += f" | Player: {player.get_playername()}"
        return output

