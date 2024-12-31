import { NextFunction, Request, Response } from "express";
import { fetchUsername } from "../services/mojang";
import { getMCUsername } from "./proxyController";

jest.mock('../services/mojang', () => ({
  fetchUsername: jest.fn(),
}));
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction;

describe('getMCUsername', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {params: {uuid: 'uuid1'}};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should fetch a username and respond with status 200 successfully', async () => {
    const mockUsername = 'username';
    (fetchUsername as jest.Mock).mockResolvedValue(mockUsername);
    await getMCUsername(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(fetchUsername).toHaveBeenCalledWith('uuid1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({username: mockUsername});
  });

  it('should log an error and respond with 500 if no uuid in params', async () => {
    mockRequest = {params: null};
    const logSpy = jest.spyOn(console, 'log');
    await getMCUsername(
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );
    expect(logSpy).toHaveBeenCalled;
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: expect.anything()});
    expect(fetchUsername).not.toHaveBeenCalled();
  });

  it('should log an error and respond with 500 if fetchUsername errors', async () => {
    const mockError = new Error('fetchUsername errored');
    (fetchUsername as jest.Mock).mockRejectedValue(mockError);
    const logSpy = jest.spyOn(console, 'log');
    await getMCUsername(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(fetchUsername).toHaveBeenCalledWith('uuid1');
    expect(logSpy).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: mockError});
  });

  it('should log an error and respond with 500 if uuid is somehow null', async () => {
    const mockError = new Error('No uuid found');
    mockRequest = {params: {uuid: null}};
    const logSpy = jest.spyOn(console, 'log');
    await getMCUsername(
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );
    expect(logSpy).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({error: mockError});
    expect(fetchUsername).not.toHaveBeenCalled();
  })
});