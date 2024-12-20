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