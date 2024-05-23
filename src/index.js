//////////////////////////////////////////////////////////////
/////////////// CONFIG ///////////////////////////////////////

import { performance } from "perf_hooks";
import { Client, Events, REST, Routes, IntentsBitField, EmbedBuilder, Collection } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

//////////////////////////////////////////////////////////////
//////////////// DATA ////////////////////////////////////////

import { USERS, SYMBOLS, CHANNEL_IDS, AVATARS } from "./data/index.js";

const emojis = SYMBOLS;
const channel_ids = CHANNEL_IDS;

//////////////////////////////////////////////////////////////
///////////////// VARS ///////////////////////////////////////

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const appCommandsRoute = Routes.applicationCommands(process.env.APPLICATION_ID);

//////////////////////////////////////////////////////////////
///////////////// API ////////////////////////////////////////

import { Utils } from "./utility/index.js";
import { EventHandlers } from "./api/handlers.js";

export const _utils = new Utils(emojis, performance);
const _handlers = new EventHandlers(emojis, _utils, EmbedBuilder);

import { commands, configureResponses } from "./api/commands.js";

//////////////////////////////////////////////////////////////
//////////////// EVENTS //////////////////////////////////////

/* deploy commands IIFE */
(async () => {
  try {
    console.log("...Started refreshing application (/) commands.");

    if (process.env.NODE_ENV === "clear") {

      await rest.put(appCommandsRoute, { body: [] });
      console.log("❌ Resetting application (/) commands...");
    } else {

      await rest.put(appCommandsRoute, { body: commands });
      console.log("✅ Successfully reloaded application (/) commands.");
    }

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

const responses = new Collection();

client.commands = configureResponses(responses);

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

  /* performance and payload loggers */
  if (process.env.NODE_ENV === "logging") {
    _handlers.logMessage(message);
  }

  /* message sent in server from any user: */
  console.log(`📌Discord message in channel ID: "${message.channelId}" from User: ${message.author.username} at ${message.createdAt}`);

  /* bot will react to any message sent provided channel ids */
  _handlers.reactToMessage(message);


});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
  // console.log(interaction.commandName);

  try {

    const command = client.commands.get(interaction.commandName);
    await command(interaction);
  } catch (error) {

    console.error(error);
  }

});


client.login(process.env.TOKEN);

  // interaction.member.user.displayName
  // interaction.member.user.globalName
  // const target = interaction.guild.members.
  // const target = interaction.member.displayName