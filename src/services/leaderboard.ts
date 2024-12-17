import { queryLeaderboard, skills } from "../db/auraskillsDb";

export async function fetchLeaderboard(leaderboardOption: string): Promise<string> {
  if (!leaderboardOption || !(skills.includes(leaderboardOption))) {
    throw new Error("Leaderboard option is not valid");
  }
  const leaderboard = await queryLeaderboard(leaderboardOption);
  return leaderboard;
}
