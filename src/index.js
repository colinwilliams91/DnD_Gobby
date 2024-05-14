import { Client, Events, REST, Routes, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import SYMBOLS from "./data/emojis.js";
const emojis = SYMBOLS;

import CHANNEL_IDS from "./data/dnd_channels.js";
const channel_ids = CHANNEL_IDS;


const commands = [ { name: "ping", description: "Replies with Pong!", options: {} } ];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const appCommandsRoute = Routes.applicationCommands(process.env.APPLICATION_ID);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(appCommandsRoute, { body: commands });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {

  console.error(error);
}

/**
 * @description This array represents the categories of Events we want available to our Bot.
 * @argument: `IntentsBitField.Flags.Guilds`
 * @satisfies Intents with "Guilds" flags facilitates Server access
 * @argument: `IntentsBitField.Flags.MessageContent`
 * @satisfies "MessageContent" permits your app to receive message content data across the APIs.
 * @see https://discord.com/developers/docs/topics/gateway#message-content-intent
 */
const intentOptions = [
  IntentsBitField.Flags.Guilds,        // <-- server
  // IntentsBitField.Flags.GuildMembers,  // <-- members in server
  IntentsBitField.Flags.GuildMessages, // <-- messages in server
  IntentsBitField.Flags.GuildMessageReactions,
  // IntentsBitField.Flags.MessageContent // <-- messages content
];

/**
 * @class: `Client` from discord.js
 * @instance: `client` is our Bot instance
 * @argument: must take in an options object with `intents` array, all other properties are optional
 *
 * @method: `.on("event" callback)` for bot event handling
 */
const client = new Client({
  intents: intentOptions
});

/**
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^ EVENT LISTENERS ^^^^^^^^^^
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */

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

  // channel_ids.forEach(element => {
  //   console.log(element);
  // });

  // emojis.forEach(element => {
  //   console.log(element);
  // });
});

client.on(Events.MessageCreate, (message) => {
  /* this validation disallows bots from responding to each other/themselves, remove at your own risk 💀 */
  if (message.author.bot) return;
  console.log(message);

  /* message sent in server from any user: */
  console.log(`Discord message: "${message.content}" from User: ${message.author.username} at ${message.createdAt}`);

  if (channel_ids.includes(message.channelId)) {
    /* bot will react to any message sent with this emoji */
    var i = Math.floor(Math.random() * (9 - 1) + 1);
    message.react(emojis[i]);
  }

});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction);

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
    // await interaction.member.setNickname
    // Set a nickname for a guild member
    // guildMember.setNickname('cool nickname', 'Needed a new nickname')
    // .then(member => console.log(`Set nickname of ${member.user.username}`))
    // .catch(console.error);
  }
});

client.login(process.env.TOKEN);
