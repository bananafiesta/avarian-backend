import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { decodeJWT, AuthenticatedRequest } from './verifyJWT';

let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
let next: NextFunction;

describe('decodeJWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: {
        authorization: "Authorization valid_token"
      },
      user: null,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('should decode a valid token and call next function', () => {
    const mockUser = 'mock_user'; 
    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockImplementation(() => mockUser);
    decodeJWT(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      next
    );

    expect(next).toHaveBeenCalled();
    expect(mockVerify).toHaveBeenCalledWith("valid_token", undefined);
    expect(mockRequest.user).toEqual(mockUser);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should respond with status 401 and an error message if auth header is missing', () => {
    mockRequest = {
      headers: {}
    };
    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockImplementation(() => {return ""});
    decodeJWT(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Token missing'});
  });

  test('should respond with status 401 and an error message if token is missing', () => {
    mockRequest = {
      headers: {
        authorization: "Authorization"
      }
    };
    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockImplementation(() => {return ""});
    decodeJWT(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Token missing'});
  });

  test('should respond with status 401 and an error message if error occurs while decoding', () => {
    const mockVerify = jest.spyOn(jwt, 'verify');
    const mockError = new Error('verification error');
    mockVerify.mockImplementation(() => {
      throw mockError;
    });
    const logSpy = jest.spyOn(console, 'log');
    decodeJWT(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(mockVerify).toHaveBeenCalledWith("valid_token", undefined);
    expect(logSpy).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({error: "Invalid token"});
  });
});