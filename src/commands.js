import { SlashCommandBuilder, Collection, PermissionFlagsBits } from "discord.js";
import { _utils } from "./index.js";
import users from "./data/users.js";

/**
 * @abstract array of commands
 * @generator `SlashCommandBuilder` - A builder that creates API-compatible JSON data for slash commands.
 * @example old commands API: `{ name: "", description: "", options: {} }`
 */
export const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    new SlashCommandBuilder().setName("name").setDescription("Append your character name to your username!").addStringOption(x => x.setName("name").setDescription("should be able to name nick")),
    new SlashCommandBuilder().setName("clear").setDescription("Resets to original username.")
];

const responses = new Collection();

responses.set(commands[0].name, async (interaction) => await interaction.reply('pong!'));

responses.set(commands[1].name, async (interaction) => {
    const name = interaction.options.getString("name");
    // const target = interaction.guild.members.fetch(name);

    interaction.member.setNickname(name, 'Needed a new nickname')
        .then(member => console.log(`Set nickname of ${interaction.member.displayName}`))
        .catch(console.error);

    console.log("~~TEST HERE~~");
    console.log(name);
    await interaction.channel.send(`Hello ${name}! ${_utils.getRandomEmoji()}`);
});

responses.set(commands[2].name, async (interaction) => {});


export const api = responses;
