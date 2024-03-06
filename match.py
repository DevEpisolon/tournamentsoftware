class Match:
    def __init__(self, matchid, slots, match_status, winner_next_match_id=None, previous_match_id=None,
                 match_winner=None, match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                 players=None):
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
        self.players = players or []  # Initialize as empty list if not provided

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

