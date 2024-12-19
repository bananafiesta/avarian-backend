import { NextFunction, Response } from "express";
import { getXconomy, authToPlayerProfiles } from "../services/profile";
import { getWallet, getProfiles, AuthenticatedRequest, user_obj } from "./profileController";

jest.mock('../services/profile', () => ({
  getXconomy: jest.fn(),
  authToPlayerProfiles: jest.fn(),
}));
let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction;

describe('getWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {user: {
      sub: 'uuid1'
    }};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should successfully get a wallet and respond with status 200', async () => {
    const mockWallet = [
      {balance: 8953, uid: 'user1'},
      {balance: 7895, uid: 'user2'},
    ];
    (getXconomy as jest.Mock).mockResolvedValue(mockWallet);
    await getWallet(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(getXconomy).toHaveBeenCalledWith('uuid1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockWallet);
  });

  it('should log errors and respond with status 500', async () => {
    const mockError = new Error('Error with getXconomy');
    (getXconomy as jest.Mock).mockRejectedValue(mockError);
    const logSpy = jest.spyOn(console, 'log');
    await getWallet(
      mockRequest as AuthenticatedRequest, 
      mockResponse as Response, 
      nextFunction
    );
    expect(getXconomy).toHaveBeenCalledWith('uuid1');
    expect(logSpy).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Error getting wallet'});
  });

  it('should catch an error and respond with status 500 if no uuid is found', async () => {
    mockRequest = {user: null};
    const logSpy = jest.spyOn(console, 'log');
    await getWallet(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );
    expect(getXconomy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Error getting wallet'});
  })
});

describe('getProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {user: {
      sub: 'uuid1'
    }};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should successfully get a list of profiles and respond with status 200', async () => {
    const mockData = [
      {player_uuid: 'asdf', balance: 50, archery: 3},
      {player_uuid: 'qwerty', balance: 31, archery: 7},
    ];
    (authToPlayerProfiles as jest.Mock).mockResolvedValue(mockData);
    await getProfiles(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );
    expect(authToPlayerProfiles).toHaveBeenCalledWith('uuid1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  it('should log errors and respond with status 500', async () => {
    const mockError = new Error('Error getting profiles');
    (authToPlayerProfiles as jest.Mock).mockRejectedValue(mockError);
    const logSpy = jest.spyOn(console, 'log');
    await getProfiles(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );
    expect(authToPlayerProfiles).toHaveBeenCalledWith('uuid1');
    expect(logSpy).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Error loading profiles'});
  });

  it('should catch an error and respond with status 500 if no uuid is found', async () => {
    mockRequest = {user: null};
    const logSpy = jest.spyOn(console, 'log');
    await getProfiles(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );
    expect(authToPlayerProfiles).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Error loading profiles'});
  });
});