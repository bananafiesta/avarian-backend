import { REST, Routes } from "discord.js";
import 'dotenv/config';
import { CommandMap } from "./commands/command-map";

const clientId = process.env.CLIENT_TEST_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TEST_TOKEN;

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
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
  } catch (error) {
    console.error(error);
  }
})();