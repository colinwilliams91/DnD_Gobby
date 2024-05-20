import { SlashCommandBuilder, Collection } from "discord.js";
import { _utils } from "./index.js";

/**
 * @abstract array of commands
 * @generator `SlashCommandBuilder` - A builder that creates API-compatible JSON data for slash commands.
 * @example old commands API: `{ name: "", description: "", options: {} }`
 */
export const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    new SlashCommandBuilder().setName("name").setDescription("Replies with your name!").addStringOption(x => x.setName("name").setDescription("should be able to name nick")),
];

export const responses = new Collection();

responses.set(commands[0].name, async (interaction) => await interaction.reply('pong!'));
responses.set(commands[1].name, async (interaction) => {
    const target = interaction.options.getString("name");
    console.log("~~TEST HERE~~");
    console.log(target);
    await interaction.channel.send(`Hello ${target}! ${_utils.getRandomEmoji()}`);
});
