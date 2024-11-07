import { SlashCommandBuilder } from "discord.js";

export const Test = {
  data: new SlashCommandBuilder()
    .setName('Test')
    .setDescription('Test command. Use responsibly.'),
  async execute(interaction) {
    await interaction.reply(`Test`)
      .then((message) => console.log(`Reply sent with content ${message.content}`))
      .catch(console.error);
  },
};