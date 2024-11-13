import { queryLeaderboard } from "../db/auraskillsDb";

export function fetchLeaderboard(): string {
  const leaderboardQuery = queryLeaderboard();
  const leaderboard = JSON.stringify(leaderboardQuery);
  return leaderboard;
}
