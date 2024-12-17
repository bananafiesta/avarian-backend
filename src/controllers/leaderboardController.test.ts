import { NextFunction, Request, Response } from "express";
import { fetchLeaderboard } from "../services/leaderboard";
import { getLeaderboard } from "./leaderboardController";

jest.mock('../services/leaderboard', () => ({
  fetchLeaderboard: jest.fn(),
}));

describe('getLeaderboard', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  beforeEach(() => {
    mockRequest = {params: {skill: 'archery'}};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a leaderboard and respond with status 200 on successful fetch', async () => {
    const mockLeaderboardData = [
      {player_uuid: 'uuid1', total: 500},
      {player_uuid: 'uuid2', total: 300},
    ];
    (fetchLeaderboard as jest.Mock).mockImplementation((option: string) => {
      return mockLeaderboardData;
    });
    await getLeaderboard(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(fetchLeaderboard).toHaveBeenCalledWith('archery');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockLeaderboardData);
  });

  it('should respond with status 500 when fetchLeaderboard throws an error', async () => {
    const fetchError = new Error('Error while fetching');
    (fetchLeaderboard as jest.Mock).mockImplementation((option: string) => {
      throw fetchError;
    })
    const logSpy = jest.spyOn(console, 'log');
    await getLeaderboard(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(fetchLeaderboard).toHaveBeenCalledWith('archery');
    expect(logSpy).toHaveBeenCalledWith(fetchError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: fetchError});
  });

  it('should call fetchLeaderboard with the skill parameter', async () => {
    mockRequest.params.skill = 'alchemy';
    await getLeaderboard(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(fetchLeaderboard).toHaveBeenCalledWith('alchemy');
  });
});