import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import 'dotenv/config'

const serversArray = [
  { name: "Velecity Proxy", value: "proxy" },
  { name: "Memories of Serenity", value: "serenity" }
]

const serverIDs = {
  "proxy": process.env.PTERODACTYL_PROXY_ID,
  "serenity": process.env.PTERODACTYL_SERENITY_ID,
}


export const Server = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Control and view information about the servers.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => subcommand
      .setName('status')
      .setDescription('Check the status of the servers.')
    )
    .addSubcommand(subcommand => subcommand
      .setName('start')
      .setDescription('Starts a server if powered off.')
      .addStringOption(option => option
        .setName('server_name')
        .setDescription('Server to start')
        .setRequired(true)
        .addChoices(serversArray)
      )
    ),

  async execute(interaction: any) {
    const options = interaction.options;
    const subCommand = options.getSubcommand();
    if (subCommand === 'status') {
      let statuses = [];
      let promises = [];
      for (const currentServer of serversArray) {
        let currStatus = {name: currentServer.name}
        const currPromise = fetch(
          `${process.env.PTERODACTYL_HOST}/api/client/servers/${serverIDs[currentServer.value]}/resources`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`
            }
          }
        ).then((result) => {
          return result.json()
        }).then((result) => {
          currStatus['status'] = result["attributes"]["current_state"];
          statuses.push(currStatus);
        });
        promises.push(currPromise);
      }
      // Wait for all fetches to finish
      await Promise.all(promises);
      // Sort to maintain order
      statuses.sort((a: {name: string}, b: {name: string}) => {
        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
      });
      let message = "";
      for (const status of statuses) {
        message = message.concat(status.name, ": ", status.status, "\n")
      }
      await interaction.reply(
        {
          content: message
        }
      );
    } else if (subCommand === 'start') {
      const targetId = options.getString('server_name');
      const targetServer = serverIDs[targetId];
      const response = await fetch(
        `${process.env.PTERODACTYL_HOST}/api/client/servers/${targetServer}/power`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PTERODACTYL_KEY}`
          },
          body: JSON.stringify({signal: "start"})
        }
      );
      if (!response.ok) {
        throw new Error(`Error while sending request to ${targetId}`)
      }
      console.log(`Started ${targetId}, if not already running`)
      await interaction.reply(
        {
          content: `Start command sent.`
        }
      )
    }
  }
}