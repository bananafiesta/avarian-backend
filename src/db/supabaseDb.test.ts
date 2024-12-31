import { getSupabaseClient } from "../services/supabase";
import { addMCAccount, getUserMCAccounts } from "./supabaseDb";

jest.mock('../services/supabase', () => ({
  getSupabaseClient: jest.fn()
}));

describe('getUserMCAccounts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Minecraft accounts successfully', async () => {
    const mockSupabase = {
      schema: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    (getSupabaseClient as jest.Mock).mockImplementation(() => mockSupabase);
    const mockData = [
      {player_uuid: 'uuid1'},
      {player_uuid: 'uuid2'},
    ];
    mockSupabase.order.mockResolvedValue({
      data: mockData,
      error: null,
    })

    const mockUUID = 'uuid1';
    const result = await getUserMCAccounts(mockUUID);

    expect(result).toEqual(mockData);
    expect(mockSupabase.schema).toHaveBeenCalledWith('public');
    expect(mockSupabase.from).toHaveBeenCalledWith('minecraft_accounts');
    expect(mockSupabase.select).toHaveBeenCalledWith('player_uuid');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockUUID);
    expect(mockSupabase.order).toHaveBeenCalledWith('player_uuid', {ascending: true});
  });

  it('should throw an error when supabase errors', async () => {
    const mockError = new Error('Supabase errored');
    const mockSupabase = {
      schema: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    (getSupabaseClient as jest.Mock).mockImplementation(() => mockSupabase);
    const mockUUID = 'uuid1';
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: mockError,
    });
    await expect(getUserMCAccounts('uuid1')).rejects.toThrow(mockError);
    expect(mockSupabase.schema).toHaveBeenCalledWith('public');
    expect(mockSupabase.from).toHaveBeenCalledWith('minecraft_accounts');
    expect(mockSupabase.select).toHaveBeenCalledWith('player_uuid');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockUUID);
    expect(mockSupabase.order).toHaveBeenCalledWith('player_uuid', {ascending: true});
  });
  
});

describe('addMCAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add a Minecraft account when an associated user exists', async () => {
    const mockSupabase = {
      schema: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
    };
    (getSupabaseClient as jest.Mock).mockImplementation(() => mockSupabase);
    const mockUUID = 'uuid1';
    const mockUsername = 'test_user';
    const mockDiscordId = '12345';
    const mockUserId = '67890';
    const mockUser = {data: {id: mockUserId}};
    mockSupabase.single.mockResolvedValueOnce(mockUser);
    mockSupabase.upsert.mockResolvedValueOnce({error: null});
    await addMCAccount(mockUUID, mockUsername, mockDiscordId);

    expect(mockSupabase.schema).toHaveBeenNthCalledWith(1, 'public');
    expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'users');
    expect(mockSupabase.select).toHaveBeenNthCalledWith(1, 'id');
    expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, 'discord_id', mockDiscordId);
    expect(mockSupabase.single).toHaveBeenCalledTimes(1);
    expect(mockSupabase.schema).toHaveBeenNthCalledWith(2, 'public');
    expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'minecraft_accounts');
    expect(mockSupabase.upsert).toHaveBeenCalledWith(
      {
        username: mockUsername,
        player_uuid: mockUUID,
        discord_id: mockDiscordId,
        id: mockUserId,
      },
      {
        ignoreDuplicates: true,
        onConflict: 'player_uuid'
      }
    );
  });

  it(`should successfully add a Minecraft account when an associated user doesn't exist`, async () => {
    const mockSupabase = {
      schema: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
    };
    (getSupabaseClient as jest.Mock).mockImplementation(() => mockSupabase);
    const mockUUID = 'uuid1';
    const mockUsername = 'test_user';
    const mockDiscordId = '12345';
    mockSupabase.single.mockResolvedValueOnce({data: null});
    mockSupabase.upsert.mockResolvedValueOnce({error: null});
    await addMCAccount(mockUUID, mockUsername, mockDiscordId);

    expect(mockSupabase.schema).toHaveBeenNthCalledWith(1, 'public');
    expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'users');
    expect(mockSupabase.select).toHaveBeenNthCalledWith(1, 'id');
    expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, 'discord_id', mockDiscordId);
    expect(mockSupabase.single).toHaveBeenCalledTimes(1);
    expect(mockSupabase.schema).toHaveBeenNthCalledWith(2, 'public');
    expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'minecraft_accounts');
    expect(mockSupabase.upsert).toHaveBeenCalledWith(
      {
        username: mockUsername,
        player_uuid: mockUUID,
        discord_id: mockDiscordId,
        id: null,
      },
      {
        ignoreDuplicates: true,
        onConflict: 'player_uuid'
      }
    );
  })

  it('should throw an error when supabase errors', async () => {
    const mockSupabase = {
      schema: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
    };
    (getSupabaseClient as jest.Mock).mockImplementation(() => mockSupabase);
    const mockUUID = 'uuid1';
    const mockUsername = 'test_user';
    const mockDiscordId = '12345';
    const mockError = new Error('Supabase errored');
    mockSupabase.upsert.mockResolvedValueOnce({error: mockError});
    await expect(addMCAccount(mockUUID, mockUsername, mockDiscordId)).rejects.toThrow(mockError);
  });
});