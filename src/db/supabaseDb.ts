import { supabase } from "../services/supabase";
import 'dotenv/config';

export async function getUserMCAccounts(uuid: string) {

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
