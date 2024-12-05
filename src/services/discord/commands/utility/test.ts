import { SlashCommandBuilder } from "discord.js";

export const Test = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command. Use responsibly.'),
  async execute(interaction) {
    await interaction.reply(`Test`);
  },
};