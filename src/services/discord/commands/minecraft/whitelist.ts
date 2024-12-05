import { MessageFlags, SlashCommandBuilder, User, PermissionFlagsBits } from "discord.js";
import { fetchUUID } from "../../../mojang";
import { addMCAccount } from "../../../../db/supabaseDb";
import 'dotenv/config'

export const Whitelist = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Controls the whitelist for the Minecraft server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => subcommand
      .setName('add')
      .setDescription('Add a player to the whitelist.')
      .addStringOption(option => option
        .setName('username')
        .setDescription(`Player's Minecraft username`)
        .setRequired(true)
        .setMinLength(3)
      )
      .addUserOption(option => option
        .setName('discord_user')
        .setDescription('Discord user to associate with')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('remove')
      .setDescription('Remove a player from the whitelist.')
      .addStringOption(option => option
        .setName('username')
        .setDescription(`Player's Minecraft username`)
        .setRequired(true)
        .setMinLength(3)
      )
    ),
    
  async execute(interaction: any) {
    const options = interaction.options;
    const subCommand = options.getSubcommand();
    const username = options.getString('username');
    if (subCommand === 'add') {
      const discordUser: User = options.getUser('discord_user');
      const discordId = discordUser.id
      // convert username to uuid first
      const uuid = await fetchUUID(username);
      await addMCAccount(uuid, username, discordId)

      // send whitelist command to pterodactyl server
      const response = await fetch(`${process.env.PTERODACTYL_HOST}/api/client/servers/${process.env.PTERODACTYL_PROXY_ID}/command`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`
        },
        body: JSON.stringify({
          command: `vcl add ${username}`
        })
      });
      if (!response.ok) {
        throw new Error(`Error while sending request to proxy`)
      }
      console.log(`Added ${username} to whitelist.`)
      
      await interaction.reply(
        {
          content: `${username} added to whitelist (or was already added).`,
          // flags: MessageFlags.Ephemeral
        }
      );
    } else if (subCommand === 'remove') {
      // send command to pterodactyl server
      const response = await fetch(`${process.env.PTERODACTYL_HOST}/api/client/servers/${process.env.PTERODACTYL_PROXY_ID}/command`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`
        },
        body: JSON.stringify({
          command: `vcl remove ${username}`
        })
      });
      if (!response.ok) {
        throw new Error('Error while sending request to proxy')
      }
      console.log(`Removed ${username} from whitelist.`)

      await interaction.reply(
        {
          content: `${username} removed from whitelist.`,
          // flags: MessageFlags.Ephemeral
        }
      );
    }
  }
  

}