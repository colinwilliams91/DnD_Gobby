//////////////////////////////////////////////////////////////
/////////////// CONFIG ///////////////////////////////////////

import { performance } from "perf_hooks";
import { Client, Events, REST, Routes, IntentsBitField, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

//////////////////////////////////////////////////////////////
//////////////// DATA ////////////////////////////////////////

import { DATA } from "./data/index.js";

const emojis = DATA.SYMBOLS;
const channel_ids = DATA.CHANNEL_IDS;

//////////////////////////////////////////////////////////////
///////////////// VARS ///////////////////////////////////////

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const appCommandsRoute = Routes.applicationCommands(process.env.APPLICATION_ID);
const prefix = process.env.CMD_PRE;

//////////////////////////////////////////////////////////////
///////////////// API ////////////////////////////////////////

import { Utils } from "./utility/index.js";
import { EventHandlers } from "./api/handlers.js";

export const _utils = new Utils(emojis, performance);
const _handlers = new EventHandlers(emojis, _utils, EmbedBuilder);

import { commands, api } from "./api/commands.js";

//////////////////////////////////////////////////////////////
//////////////// EVENTS //////////////////////////////////////

/* deploy commands IIFE */
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(appCommandsRoute, { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {

    console.error(error);
  }
})();

/**
 * @see https://discord.com/developers/docs/topics/gateway#message-content-intent
 */
const intentOptions = [
  IntentsBitField.Flags.Guilds,        // <-- server
  // IntentsBitField.Flags.GuildMembers,  // <-- members in server
  IntentsBitField.Flags.GuildMessages, // <-- messages in server
  IntentsBitField.Flags.GuildMessageReactions,
  // IntentsBitField.Flags.MessageContent // <-- messages content
];

const client = new Client({
  intents: intentOptions
});

client.commands = api;

//////////////////////////////////////////////////////////////
/////////////// REGISTER /////////////////////////////////////

/**
 * @see https://old.discordjs.dev/#/docs/discord.js/main/general/welcome
 * @description: for BOT API documentation
 */

client.once(Events.ClientReady, (bot) => {
  console.log(`✅ ${bot.options.rest.authPrefix} ${bot.user.tag} is online!`);

  console.log(`✅ Listening to bot.channels:`)
  for (const key in bot.channels) {
    console.log(`- Key: ${key}`);
    console.log(`- Value: ${bot.channels[key]}`);
  }

});

client.on(Events.MessageCreate, (message) => {
  /* this validation disallows bots from responding to each other/themselves, remove at your own risk 💀 */
  if (message.author.bot || !channel_ids.get(message.channelId)) return;

  /* message sent in server from any user: */
  console.log(`Discord message: "${message.content}" from User: ${message.author.username} at ${message.createdAt}`);

  /* bot will react to any message sent provided channel ids */
  _handlers.reactToMessage(message);

  /* performance and payload loggers */
  if (process.env.NODE_ENV === "development") {
    _handlers.logMessage(message);
  }

});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // console.log(interaction);
  // interaction.member.user.displayName
  // interaction.member.user.globalName

  const command = client.commands.get(interaction.commandName);

  // const target = interaction.guild.members.
  // const target = interaction.member.displayName

  await command(interaction);

  // TODO:
    // await interaction.member.setNickname
    // Set a nickname for a guild member
    // guildMember.setNickname('cool nickname', 'Needed a new nickname')
    // .then(member => console.log(`Set nickname of ${member.user.username}`))
    // .catch(console.error);

});

client.login(process.env.TOKEN);
