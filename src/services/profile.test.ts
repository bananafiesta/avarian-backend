import { skills, querySkill } from "../db/auraskillsDb";
import { getUserMCAccounts } from "../db/supabaseDb"
import { findUserEconomy, findUsersEconomy } from "../db/xconomyDb";
import { authToPlayerProfiles, getXconomy } from "./profile";

jest.mock('../db/auraskillsDb', () => ({
  querySkill: jest.fn(),
  skills: [
    'archery',
    'mining',
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all balances for valid user ids', async () => {
    const mockUUIDs = [
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    (getUserMCAccounts as jest.Mock).mockResolvedValueOnce(mockUUIDs);
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

  it('should return an empty array if invalid uuid is given', async () => {
    const mockEmptyList = [];
    (getUserMCAccounts as jest.Mock).mockResolvedValue(mockEmptyList);
    const invalidUUID = 'invalid_uuid';
    const result = await getXconomy(invalidUUID);
    expect(getUserMCAccounts).toHaveBeenCalledWith(invalidUUID);

    expect(result).toEqual([]);
    expect(findUsersEconomy).not.toHaveBeenCalled();
  });

  it('should throw an error if getUserMCAccounts errors', async () => {
    const mockError = new Error('Error getting User Mc accounts');
    (getUserMCAccounts as jest.Mock).mockImplementation(() => {throw mockError});
    await expect(getXconomy('uuid1')).rejects.toThrow(mockError);
    expect(findUsersEconomy).not.toHaveBeenCalled();
  });

  it('should throw an error if findUsersEconomy errors', async () => {
    const mockError = new Error('Error finding users economy objects');
    const mockUUIDs = [
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    (getUserMCAccounts as jest.Mock).mockResolvedValue(mockUUIDs);
    (findUsersEconomy as jest.Mock).mockRejectedValue(mockError.message);
    const testUUID = 'any_uuid';
    await expect(getXconomy(testUUID)).rejects.toBe(mockError.message);
    expect(getUserMCAccounts).toHaveBeenCalledWith(testUUID);
    expect(findUsersEconomy).toHaveBeenCalledWith(['uuid1', 'uuid2']);
  });

});

describe('authToPlayerProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a sorted profile for valid uuids', async () => {
    const mockPIDs = [
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    (getUserMCAccounts as jest.Mock).mockResolvedValue(mockPIDs);
    const mockBalance = [
      {balance: 32},
    ];
    (findUserEconomy as jest.Mock).mockResolvedValue(mockBalance);
    (querySkill as jest.Mock).mockImplementation((skill, pid) => {
      return new Promise((resolve, reject) => {
        if (skill == 'archery') {
          resolve(
            [
              {total: 2},
            ]
          );
        };
        if (skill == 'mining') {
          resolve(
            [
              {total: 3},
            ]
          );
        };
      });
      
    });
    const validUUID = 'valid_uuid';
    const result = await authToPlayerProfiles(validUUID);
    expect(getUserMCAccounts).toHaveBeenCalledWith(validUUID);
    expect(findUserEconomy).toHaveBeenNthCalledWith(1, 'uuid1');
    expect(findUserEconomy).toHaveBeenNthCalledWith(2, 'uuid2');
    expect(querySkill).toHaveBeenNthCalledWith(1, 'archery', 'uuid1');
    expect(querySkill).toHaveBeenNthCalledWith(2, 'mining', 'uuid1');
    expect(querySkill).toHaveBeenNthCalledWith(3, 'archery', 'uuid2');
    expect(querySkill).toHaveBeenNthCalledWith(4, 'mining', 'uuid2');
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('uuid', 'uuid1');
    expect(result[0]).toHaveProperty('archery', 2);
    expect(result[0]).toHaveProperty('mining', 3);
    expect(result[0]).toHaveProperty('balance', 32);
    expect(result[1]).toHaveProperty('uuid', 'uuid2');
    expect(result[1]).toHaveProperty('archery', 2);
    expect(result[1]).toHaveProperty('mining', 3);
    expect(result[1]).toHaveProperty('balance', 32);

  });

  it('should return an empty array if no associated MC accounts are found', async () => {
    const invalidUUID = 'invalid_uuid';
    (getUserMCAccounts as jest.Mock).mockResolvedValue([]);
    const result = await authToPlayerProfiles(invalidUUID);
    expect(getUserMCAccounts).toHaveBeenCalledWith(invalidUUID);
    expect(result).toEqual([]);
    expect(findUserEconomy).not.toHaveBeenCalled();
    expect(querySkill).not.toHaveBeenCalled();
  });

  it('should uuids correctly', async () => {
    const mockPIDs = [
      {player_uuid: 'uuid3'},
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    (getUserMCAccounts as jest.Mock).mockResolvedValue(mockPIDs);
    const mockBalance = [
      {balance: 32},
    ];
    (findUserEconomy as jest.Mock).mockResolvedValue(mockBalance);
    (querySkill as jest.Mock).mockImplementation((skill, pid) => {
      return new Promise((resolve, reject) => {
        if (skill == 'archery') {
          resolve(
            [
              {total: 2},
            ]
          );
        };
        if (skill == 'mining') {
          resolve(
            [
              {total: 3},
            ]
          );
        };
      });
      
    });
    const validUUID = 'valid_uuid';
    const result = await authToPlayerProfiles(validUUID);
    expect(result).toHaveLength(4);
    expect(result[0]).toHaveProperty('uuid', 'uuid1');
    expect(result[1]).toHaveProperty('uuid', 'uuid1');
    expect(result[2]).toHaveProperty('uuid', 'uuid2');
    expect(result[3]).toHaveProperty('uuid', 'uuid3');
  });
});