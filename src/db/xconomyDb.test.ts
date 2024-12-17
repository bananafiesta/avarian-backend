import { findUserEconomy, findUsersEconomy } from "./xconomyDb";

const mockConnection = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn()
};
jest.mock('mysql', () => ({
  createConnection: jest.fn((any) => mockConnection)
}));

describe('findUsersEconomy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should query for all wallets successfully', async () => {
    const mockRows = [
      {balance: 50, uid: 'uuid1'},
      {balance: 127, uid: 'uuid2'},
    ];
    mockConnection.query.mockImplementation((query, uuids, callback) => {
      callback(null, mockRows, null);
    });
    const result = await findUsersEconomy(['uuid1', 'uuid2']);
    expect(mockConnection.query).toHaveBeenCalledWith(
      `SELECT balance, uid FROM xconomy WHERE uid in (?)`,
      [['uuid1', 'uuid2']],
      expect.any(Function)
    );
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
    expect(result).toEqual(mockRows);

  });
});