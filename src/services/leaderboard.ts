import { queryLeaderboard } from "../db/auraskillsDb";

export async function fetchLeaderboard(): Promise<string> {
  const leaderboardQuery = await queryLeaderboard();
  const leaderboard = JSON.stringify(leaderboardQuery);
  return leaderboard;
}
