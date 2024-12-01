import { SlashCommandBuilder } from "discord.js";

export const Whitelist = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Adds a player to the Minecraft server whitelist while associating their Minecraft and Discord accounts.')
    .addStringOption(option => 
      option.setName('mode')
        .setDescription('Whitelist action to take')
        .setRequired(true)
        .addChoices(
          { name: 'Add to whitelist', value: 'add' },
          { name: 'Remove from whitelist', value: 'remove' }
        ))
    .addStringOption(option => 
      option.setName('username')
        .setDescription(`Player's Minecraft username`)
        .setRequired(true)
        .setMinLength(3)
    )
    .addUserOption(option =>
      option.setName('discord user')
        .setDescription('Discord user to associate with (only needed for adding)')
        .setRequired(false)
    ),
  async execute(interaction) {
    
  }
  

}