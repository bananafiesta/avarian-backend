import { SlashCommandBuilder } from "discord.js";

export const Whitelist = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Controls the whitelist for the Minecraft server.')
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
        option.setName('discord user')
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
    
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === 'add') {

    } else if (subCommand === 'remove') {

    }
  }
  

}