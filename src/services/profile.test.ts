import { skills, querySkill } from "../db/auraskillsDb";
import { getUserMCAccounts } from "../db/supabaseDb"
import { findUserEconomy, findUsersEconomy } from "../db/xconomyDb";
import { getXconomy } from "./profile";

jest.mock('../db/auraskillsDb', () => ({
  querySkill: jest.fn(),
  skills: [
    'archery',
    'alchemy',
  ]
}));
jest.mock('../db/supabaseDb', () => ({
  getUserMCAccounts: jest.fn(),
}));
jest.mock('../db/xconomyDb', () => ({
  findUserEconomy: jest.fn(),
  findUsersEconomy: jest.fn(),
}));

describe('getXconomy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all balances for valid user ids', async () => {
    const mockUUIDs = [
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    (getUserMCAccounts as jest.Mock).mockResolvedValue(mockUUIDs);
    const mockEconomyObjs = [
      {balance: 57, uid: 'uuid1'},
      {balance: 31, uid: 'uuid2'},
    ];
    (findUsersEconomy as jest.Mock).mockResolvedValue(mockEconomyObjs);
    const validUUID = 'valid_uuid';
    const result = await getXconomy(validUUID);
    expect(getUserMCAccounts).toHaveBeenCalledWith(validUUID);
    expect(findUsersEconomy).toHaveBeenCalledWith(['uuid1', 'uuid2']);
    expect(result).toBe(mockEconomyObjs);
  });

  it('should throw an error if getUserMCAccounts errors', async () => {
    const mockError = new Error('Error getting User Mc accounts');
    (getUserMCAccounts as jest.Mock).mockImplementation(() => {throw mockError});
    await expect(getXconomy('uuid1')).rejects.toThrow(mockError);
    expect(findUsersEconomy).not.toHaveBeenCalled();
  });

  it('should throw an error if findUsersEconomy errors', async () => {

  });
  
});