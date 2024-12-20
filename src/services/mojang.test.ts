import { fetchUsername, fetchUUID } from "./mojang";

describe('fetchUsername', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a username when given a uuid', async () => {
    const mockResponse: Partial<Response> = {
      json: jest.fn().mockResolvedValue({name: 'username'}),
      ok: true,
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as Response);
    const result = await fetchUsername('uuid1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('uuid1')
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual('username');
  });

  it('should throw an error if the fetch fails', async () => {
    const mockError = new Error('Fetch failed');
    const fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(mockError);
    await expect(fetchUsername('valid_uuid')).rejects.toBe(mockError);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('valid_uuid'))
  });

  it('should throw an error if response is not ok', async () => {
    const mockResponse: Partial<Response> = {
      json: jest.fn(),
      ok: false,
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as Response);
    await expect(fetchUsername('invalid_uuid')).rejects.toThrow('Error fetching name from Mojang');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('invalid_uuid'));
  });
});

describe('fetchUUID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a uuid when given a username', async () => {
    const mockUUID = 'valid_uuid'
    const mockUsername = 'username'
    const mockResponse: Partial<Response> = {
      json: jest.fn().mockResolvedValue({id: mockUUID}),
      ok: true,
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as Response);
    const result = await fetchUUID(mockUsername);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(mockUsername));
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockUUID);
  });

  it('should throw an error if the fetch fails', async () => {
    const mockError = new Error('Fetch failed');
    const mockUsername = 'valid_username';
    const fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(mockError);
    await expect(fetchUUID(mockUsername)).rejects.toBe(mockError);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(mockUsername));
  });

  it('should throw an error if response is not ok', async () => {
    const mockResponse: Partial<Response> = {
      json: jest.fn(),
      ok: false,
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as Response);
    const mockUsername = 'invalid_username';
    await expect(fetchUUID(mockUsername)).rejects.toThrow('Error fetching UUID from Mojang');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(mockUsername));
  });
});