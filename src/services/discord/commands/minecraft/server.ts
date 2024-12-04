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
        .setName('server_id')
        .setDescription('Server to start')
        .setRequired(true)
        .addChoices(serversArray)
      )
    ),

  async execute(interaction: any) {
    const options = interaction.options;
    const subCommand = options.getSubcommand();
    if (subCommand === 'status') {
      const output = []
      for (const currentServer of serversArray) {
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
        )
      }
    } else if (subCommand === 'start') {

    }
  }
}