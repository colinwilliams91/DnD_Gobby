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

//////////////////////////////////////////////////////////////
///////////////// ping ///////////////////////////////////////
/**
 * @summary /ping
 * @description test route responds "pong"
 */
responses.set(commands[0].name, async (interaction) => await interaction.reply('pong!'));

//////////////////////////////////////////////////////////////
///////////////// name ///////////////////////////////////////
/**
 * @summary /name arg
 * @description user input arg (char name) appends to original user nickname
 */
responses.set(commands[1].name, async (interaction) => {
    const input = interaction.options.getString("name");
    const orig = interaction.member.nickname;
    const id = interaction.member.user.id;

    const name = `${orig} [${input}]`;

    /* cache user's orig name by user id */
    if (!users[id]) users[id] = orig;

    interaction.member.setNickname(name, "Append user's character name")
        .then(member => console.log(`Set nickname of ${interaction.member.displayName}`))
        .catch(console.error);

    console.log("~~TEST HERE~~");
    console.log(name);
    await interaction.channel.send(`Hello ${name}! ${_utils.getRandomEmoji()}`);
});

//////////////////////////////////////////////////////////////
///////////////// clear //////////////////////////////////////
/**
 * @summary /clear
 * @description resets user nickname to original
 */
responses.set(commands[2].name, async (interaction) => {
    let orig = "";
    const id = interaction.member.user.id;

    if (users[id]) {
        orig = users[id];

    } else if (interaction.member.nickname) {
        orig = interaction.member.nickname;

    } else if (interaction.member.user.displayName) {
        orig = interaction.member.user.displayName;

    } else {
        orig = interaction.member.user.globalName;

    }

    interaction.member.setNickname(orig, "Reset user's nickname")
        .then(member => console.log(`Set nickname of ${interaction.member.displayName}`))
        .catch(console.error);

    await interaction.channel.send(`See you next time ${orig}! ${_utils.getRandomEmoji()}`);

});

export const api = responses;
