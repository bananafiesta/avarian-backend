import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

import { CommandMap } from './commands/command-map.js';
import { EventList } from './events/eventlist.js';
import { isMember, hasPermission } from './verify.js';



const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// Load commands
for (const commandName in CommandMap) {
  const command = CommandMap[commandName];
  console.log(command);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command ${commandName} is missing a required "data" or "execute" property.`);
  }
}

// Load Events
for (const event of EventList) {

  if ('once' in event) {
    client.once(event.name, (...args: Parameters<typeof event.execute>) => event.execute(...args));
  } else {
    client.on(event.name, (...args: Parameters<typeof event.execute>) => event.execute(...args));
  }
}

client.login(token);
