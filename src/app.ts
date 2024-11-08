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


for (const event of EventList) {

  if ('once' in event) {
    client.once(event.name, (...args: Parameters<typeof event.execute>) => event.execute(...args));
  } else {
    client.on(event.name, (...args: Parameters<typeof event.execute>) => event.execute(...args));
  }
}

client.login(token);
