import { Client, Guild, Snowflake } from "discord.js"

export async function isMember(client: Client, uid: Snowflake, gid: Snowflake): Promise<boolean> {
  const guild: Guild | undefined = client.guilds.cache.get(gid);
  if (guild === undefined) {
    throw new Error("Guild ID undefined.");
  }
  const membership: boolean = await guild.members.fetch(uid)
    .then(() => true)
    .catch(() => false);

  return membership;
}