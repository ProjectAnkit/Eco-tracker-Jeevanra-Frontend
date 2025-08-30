export interface Challenge {
  id: number;
  name: string;
  goal: number;
  participants: {
    id: number;
    name: string;
    co2Saved: number;
  }[];
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  co2Saved: number;
  rank: number;
}

export interface CreateChallengeData {
  name: string;
  goal: number;
}
