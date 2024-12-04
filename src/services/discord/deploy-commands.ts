import { REST, Routes } from "discord.js";
import 'dotenv/config';
import { CommandMap } from "./commands/command-map";

const clientId = process.env.CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];

for (const commandName in CommandMap) {
  const command = CommandMap[commandName];
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command ${commandName} is missing a required "data" or "execute" property.`);
  }
};

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
  } catch (error) {
    console.error(error);
  }
})();