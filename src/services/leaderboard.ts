import { queryLeaderboard } from "../db/auraskillsDb";

export async function fetchLeaderboard(): Promise<string> {
  const leaderboard = await queryLeaderboard();
  return leaderboard;
}
