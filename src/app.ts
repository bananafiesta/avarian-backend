import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CommandMap } from './commands/command-map.js';
import { EventList } from './events/eventlist.js';



const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


for (const commandName in CommandMap) {
  const command = CommandMap[commandName];
  console.log(command);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command ${commandName} is missing a required "data" or "execute" property.`);
  }
}

// client.once(Events.ClientReady, readyClient => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

for (const event of EventList) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;
//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({ context: 'There was an error while executing this command!', ephemeral: true});
//     } else {
//       await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
//     }
//   }
// });
