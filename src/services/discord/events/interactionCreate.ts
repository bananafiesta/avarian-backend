import { ClientEvents, Events } from "discord.js";

export const InteractionCreate = {
  name: Events.InteractionCreate as keyof ClientEvents,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command: ${interaction.commandName}`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral:true });
      }
    }
  },
};