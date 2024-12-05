import { supabase } from "../services/supabase";
import 'dotenv/config';

export async function getUserMCAccounts(uuid: string): Promise<any[]> {

  const { data, error } = await supabase
    .schema('public')
    .from('minecraft_accounts')
    .select('player_uuid')
    .eq('id', `${uuid}`)
    .order('player_uuid', {ascending: true});
  
  if (error) {
    throw(error);
  }
  return data;

}

export async function addMCAccount(uuid: string, username: string, discordId: string): Promise<void> {
  const { data: user } = await supabase
    .schema('public')
    .from('users')
    .select('id')
    .eq('discord_id', discordId)
    .single()

  const supabaseId = user ? user.id : null;
  const { error } = await supabase
    .schema('public')
    .from('minecraft_accounts')
    .upsert(
      {
        username: username, 
        player_uuid: uuid, 
        discord_id: discordId, 
        id: supabaseId
      }, 
      {
        ignoreDuplicates: true, 
        onConflict: 'player_uuid'
      }
    );
  if (error) {
    throw(error);
  }
  return;
}
