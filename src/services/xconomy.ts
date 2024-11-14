import { getUserMCAccounts } from "../db/supabaseDb"
import { findUserEconomy } from "../db/xconomyDb";

export interface economy_obj {
  balance: number,
  uid: string
}

export async function getXconomy(uuid: string): Promise<economy_obj[]> {

  const pid_objs: {player_uuid: string}[] = await getUserMCAccounts(uuid);
  const player_uuids: string[] = pid_objs.map(obj => obj.player_uuid);
  const economy_objs: economy_obj[] = await findUserEconomy(player_uuids);
  return economy_objs;

}