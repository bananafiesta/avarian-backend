

const mockConnection = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn()
};
jest.mock('mysql', () => ({
  createConnection: jest.fn((any) => mockConnection)
}));