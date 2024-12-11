import time


class Match:
    def __init__(
        self,
        matchid,
        slots,
        max_rounds,
        winner_next_match_id,
        match_status=1,
        tournamentName="temp",
        previous_match_id=None,
        players=None,
        match_winner=None,
        match_loser=None,
        loser_next_match_id=None,
        start_date=None,
        end_date=None,
        startTime=None,
        endTime=None,
        round_wins=None,
        round_losses=None,
        round_ties=None,
        num_wins=None,
        bracket_position=None,
        tournamentRoundNumber=None,
    ):
        self.matchid = matchid
        self.slots = slots
        self.match_status = match_status
        self.winner_next_match_id = winner_next_match_id
        self.previous_match_id = previous_match_id
        self.match_winner = match_winner
        self.match_loser = match_loser
        self.loser_next_match_id = loser_next_match_id
        self.start_date = start_date
        self.end_date = end_date
        self.bracket_position = bracket_position
        self.tournamentRoundNumber = tournamentRoundNumber

        if players is None:
            self.players = []
        else:
            self.players = players
        # best of 3, 5, etc
        self.max_rounds = max_rounds
        self.num_wins = 0
        for i in range(1, max_rounds + 1):
            if (i % 2) != 0:
                self.num_wins += 1
        # keeps track of the players win
        if round_wins is None:
            self.round_wins = {}
        else:
            self.round_wins = round_wins
        if round_losses is None:
            self.round_losses = {}
        else:
            self.round_losses = round_losses
        if round_ties is None:
            self.round_ties = {}
        else:
            self.round_ties = round_ties
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
        if self.match_status == 0:
            return "In Progress"
        elif self.match_status == 1:
            return "Not Started"
        elif self.match_status == 2:
            return "Finished"

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

    # 0: In Progress
    # 1: Not Started
    # 2: Finished
    def set_match_status(self, match_status):
        self.match_status = match_status

    def set_winner_next_match_id(self, winner_next_match_id):
        self.winner_next_match_id = winner_next_match_id

    def set_previous_match_id(self, previous_match_id):
        self.previous_match_id = previous_match_id

    def set_match_winner(self, match_winner):
        for player in self.players:
            if player.displayname == match_winner.displayname:
                self.match_winner = player

    def set_match_loser(self, match_loser):
        for player in self.players:
            if player.displayname == match_loser.displayname:
                self.match_loser = player

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

    def set_bracketPosition(self, position):
        self.bracket_position = position

    def get_bracketPosition(self):
        return self.bracket_position

    def get_tournamentRoundNumber(self):
        return self.tournamentRoundNumber

    def set_tournamentRoundNumber(self, number):
        self.tournamentRoundNumber = number

    def add_players(self, player):
        """
        player(Player): player to add

        Adds the player to the match if there are slots available.
        """
        if len(self.players) >= self.slots:
            print("Error: There are too many players.")
        else:
            self.players.append(player)

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

    def update_rounds(self, winner, matches):
        """
        winner(Player): the winner of a round

        If this is a best of 3, then this function will update self.rounds to reflect the outcome.
        """
        self.set_match_status(0)
        print(f"{winner.get_playername()} won this round")
        print(self)
        print("\n")
        for player in self.get_players():
            if winner.displayname == player.displayname:
                self.round_wins[player.displayname] = (
                    self.round_wins.get(player.displayname, 0) + 1
                )
                player.set_current_tournament_wins(
                    player.get_current_tournament_wins() + 1
                )
            else:
                self.round_losses[player.displayname] = (
                    self.round_losses.get(player.displayname, 0) + 1
                )
                player.set_current_tournament_losses(
                    player.get_current_tournament_losses() + 1
                )
        if self.round_wins[winner.displayname] >= self.num_wins:
            self.set_match_winner(winner)
            self.set_match_loser()
            self.set_match_status(2)
            self.move_winner(matches)

    def move_winner(self, matches):
        for next_match in matches:
            if next_match.get_matchid() == self.matchid + self.winner_next_match_id:
                next_match.add_players(self.match_winner)
                break

    def set_round_winner(self, matches, winner):
        if winner.get_playername() not in self.rounds:
            self.rounds[winner.get_playername()] = 0
        else:
            self.rounds[winner.get_playername()] += 1
            if self.rounds[winner.get_playername()] == int(self.max_rounds):
                self.set_match_winner(winner)
                for i in range(len(matches)):
                    if (
                        matches[i].get_matchid()
                        == self.matchid + self.winner_next_match_id
                    ):
                        matches[i].add_players(self.get_match_winner())
                        self.set_match_status(2)
                        print(
                            f"{self.get_match_winner().get_playername()} won the match and is moving onto match {matches[i].get_matchid()}"
                        )
                        break

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
        output = (
            f"Match ID: {self.get_matchid()} | Next Match ID: {self.get_winner_next_match_id() + self.get_matchid()}"
            f" | Match Status: {self.get_match_status()}"
        )
        for player in self.players:
            output += f" | Player: {player.get_playername()}"
        if self.get_match_status() == "Finished":
            output += f" | Winner: {self.get_match_winner().playername} | Loser: {self.get_match_loser().playername}"
        return output
