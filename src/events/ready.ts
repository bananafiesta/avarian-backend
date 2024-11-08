import { Events, ClientEvents } from "discord.js";

export const Ready = {
  name: Events.ClientReady as keyof ClientEvents,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};