import { Client, Guild, Snowflake, GuildMember, Role } from "discord.js"

export async function isMember(client: Client, uid: Snowflake, gid: Snowflake): Promise<boolean> {
  const guild: Guild | undefined = await client.guilds.fetch(gid);
  if (guild === undefined) {
    throw new Error("Guild ID undefined.");
  }
  const membership: boolean = await guild.members.fetch(uid)
    .then(() => true)
    .catch(() => false);

  return membership;
}

export async function hasPermission(client: Client, uid: Snowflake, gid: Snowflake, roleId: Snowflake): Promise<boolean> {
  const guild: Guild | undefined = await client.guilds.fetch(gid);
  if (guild === undefined) {
    throw new Error("Guild ID undefined.");
  }
  let guildMember: GuildMember | undefined = undefined;
  try {
    guildMember = await guild.members.fetch(uid);
  } catch (error) {
    return false;
  }

  let role: Role | undefined = guildMember.roles.cache.get(roleId);

  

  return role !== undefined;
}