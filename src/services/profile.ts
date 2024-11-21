import { skills, querySkill } from "../db/auraskillsDb";
import { getUserMCAccounts } from "../db/supabaseDb"
import { findUserEconomy, findUsersEconomy } from "../db/xconomyDb";

export interface economy_obj {
  balance: number,
  uid: string
}

export async function getXconomy(uuid: string): Promise<economy_obj[]> {
  const pid_objs: {player_uuid: string}[] = await getUserMCAccounts(uuid);
  const player_uuids: string[] = pid_objs.map(obj => obj.player_uuid);
  const economy_objs: economy_obj[] = await findUsersEconomy(player_uuids);
  return economy_objs;
}

export async function authToPlayerProfiles(authUUID: string) {
  const pid_objs: {player_uuid: string}[] = await getUserMCAccounts(authUUID);
  const player_uuids: string[] = pid_objs.map(obj => obj.player_uuid);
  if (player_uuids.length == 0) {
    return [];
  }
  let output = [];
  let profilePromise = [];
  for (const player_uuid in player_uuids) {
    let player = {uuid: player_uuid};
    let promises = [];
    const balancePromise = findUserEconomy(player_uuid).then((result) => {
      player['balance'] = result.balance;
    });
    promises.push(balancePromise);
    for (const skill in skills) {
      let tempPromise = querySkill(skill, player_uuid).then((result) => {
        player[`${skill}`] = result.total;
      })
      promises.push(tempPromise);
    }
    const playerPromise = Promise.all(promises).then(() => output.push(player));
    profilePromise.push(playerPromise);
  }
  await Promise.all(profilePromise);
  return output
}