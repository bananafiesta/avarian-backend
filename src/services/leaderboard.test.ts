import { queryLeaderboard } from "../db/auraskillsDb";
import { fetchLeaderboard } from "./leaderboard";

jest.mock('../db/auraskillsDb', () => ({
  queryLeaderboard: jest.fn(),
  skills: ['excavation']
}));

describe('fetchLeaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should fetch valid leaderboard options successfully', async () => {
    const mockLeaderboard = [
      {player_uuid: 'uuid1', total: 53},
      {player_uuid: 'uuid843757', total: 2},
    ];
    const option = 'excavation';
    (queryLeaderboard as jest.Mock).mockImplementation((option) => mockLeaderboard)
    const result = await fetchLeaderboard(option);
    expect(queryLeaderboard).toHaveBeenCalledWith(option);
    expect(result).toBe(mockLeaderboard);
  });

  it('should throw an error if leaderboardOption is not in skills', async () => {
    const invalidOption = 'invalid option';
    await expect(fetchLeaderboard(invalidOption))
      .rejects
      .toThrow('Leaderboard option is not valid');
    expect(queryLeaderboard).not.toHaveBeenCalled();
  });
});