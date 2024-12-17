import { queryLeaderboard, querySkill } from './auraskillsDb';

const mockConnection = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn()
};
jest.mock('mysql', () => ({
  createConnection: jest.fn((any) => mockConnection)
}));


describe('queryLeaderboard', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query for the total leaderboard successfully', async () => {
    const mockRows = [
      {player_uuid: 'uuid1', total: 500},
      {player_uuid: 'uuid2', total: 125},
    ];

    mockConnection.query.mockImplementation((query, callback) => {
      callback(null, mockRows, null);
    });

    const result = await queryLeaderboard('total');

    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT users.player_uuid, SUM(skills.skill_level) as total'),
      expect.any(Function)
    );
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

  it('should query specific skill leaderboards successfully', async () => {
    const mockRows = [
      {player_uuid: 'uuid1', total: 73},
      {player_uuid: 'uuid2', total: 24},
      {player_uuid: 'uuid3', total: 3},
    ];

    mockConnection.query.mockImplementation((query, callback) => {
      callback(null, mockRows, null);
    });

    const result = await queryLeaderboard('mining');

    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE skills.skill_name = 'auraskills/mining'"),
      expect.any(Function)
    );
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

  it('should throw an error for invalid leaderboard options', async () => {
    await expect(queryLeaderboard('invalid option'))
      .rejects
      .toThrow('Invalid leaderboard option');

    expect(mockConnection.query).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const dbError = Error('Database connection failed');

    mockConnection.query.mockImplementation((query, callback) => {
      callback(dbError, null, null);
    });

    await expect(queryLeaderboard('total'))
      .rejects
      .toBe(dbError.message);

    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
  });
})

describe('querySkill', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query for the total skill level successfully', async () => {
    const mockRows = [
      {total: 33}
    ];
    mockConnection.query.mockImplementation((query, callback) => {
      callback(null, mockRows, null);
    });

    const result = await querySkill('total', 'uuid1');
    
    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT SUM(skills.skill_level) as total FROM"),
      expect.any(Function)
    );
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

  it('should query for individual skills successfully', async () => {
    const mockRows = [
      {total: 48}
    ];
    mockConnection.query.mockImplementation((query, callback) => {
      callback(null, mockRows, null);
    });
    const result = await querySkill('archery', 'uuid1');
    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE users.player_uuid = 'uuid1' AND skills.skill_name = 'auraskills/archery'"),
      expect.any(Function)
    );
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

  it('should throw an error for invalid leaderboard options', async () => {
    await expect(querySkill('invalid option', 'uuid1'))
      .rejects
      .toThrow('Invalid leaderboard option');

    expect(mockConnection.query).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const dbError = Error('Database connection failed');

    mockConnection.query.mockImplementation((query, callback) => {
      callback(dbError, null, null);
    });
    await expect(querySkill('total', 'uuid1'))
      .rejects
      .toBe(dbError.message);

    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
  });
});
