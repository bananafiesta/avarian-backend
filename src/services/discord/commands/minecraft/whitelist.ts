import { MessageFlags, SlashCommandBuilder, User, PermissionFlagsBits } from "discord.js";
import { fetchUUID } from "../../../mojang";
import { addMCAccount } from "../../../../db/supabaseDb";

export const Whitelist = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Controls the whitelist for the Minecraft server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => 
      subcommand.setName('add')
      .setDescription('Add player to the whitelist')
      .addStringOption(option => 
        option.setName('mode')
        .setDescription('Whitelist action to take')
        .addChoices(
          { name: 'Add to whitelist', value: 'add' }
        )
      )
      .addStringOption(option => 
        option.setName('username')
        .setDescription(`Player's Minecraft username`)
        .setRequired(true)
        .setMinLength(3)
      )
      .addUserOption(option => 
        option.setName('discordUser')
        .setDescription('Discord user to associate with')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => 
      subcommand.setName('remove')
      .setDescription('Remove player from the whitelist')
      .addStringOption(option => 
        option.setName('mode')
        .setDescription('Whitelist action to take')
        .addChoices(
          { name: 'Remove from whitelist', value: 'remove' }
        )
      )
      .addStringOption(option => 
        option.setName('username')
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
      const discordUser: User = options.getUser('discordUser');
      const discordId = discordUser.id
      // convert username to uuid first
      const uuid = await fetchUUID(username);
      await addMCAccount(uuid, username, discordId)

      // send whitelist command to pterodactyl server
      // TODO

      
      await interaction.reply(
        {
          content: `${username} added to whitelist (or was already added).`,
          flags: MessageFlags.Ephemeral
        }
      );
    } else if (subCommand === 'remove') {
      await interaction.reply(
        {
          content: `Command not implemented yet`,
          flags: MessageFlags.Ephemeral
        }
      );
    }
  }
  

}