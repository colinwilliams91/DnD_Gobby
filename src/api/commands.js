import { SlashCommandBuilder, Collection, PermissionFlagsBits } from "discord.js";
import { _utils } from "../index.js";
import users from "../data/users.js";
import { sendEmbed, sendSay } from "./embeds.js";

// TODO: Make this into API Controller/Class?
// TODO: Cache "current" map..
// TODO: Make `/set arg...` route

export const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    new SlashCommandBuilder().setName("name").setDescription("Append your character name to your username!").addStringOption(x => x.setName("name").setDescription("should be able to name nick")),
    new SlashCommandBuilder().setName("clear").setDescription("Resets to original username."),
    new SlashCommandBuilder().setName("say").setDescription("Type what you want your character to say:").addStringOption(x => x.setName("message").setDescription("content")),
];

// const responses = new Collection();

export const configureResponses = (responses) => {

    //////////////////////////////////////////////////////////////
    ///////////////// ping ///////////////////////////////////////

    /**
     * @summary /ping
     * @description test route responds "pong"
     */
    responses.set(commands[0].name, async (interaction) => {
        // await interaction.reply('pong!')
        try {

            await sendEmbed(interaction);
            await _utils.handleBotReply(interaction);
        } catch (error) {

            console.error(error);
        }
    });

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

        const name = `[${input}]`;

        /* cache user's orig name by user id */
        if (!users[id]) users[id] = orig;

        interaction.member.setNickname(name, "Append user's character name")
            .then(member => console.log(`Set nickname of ${interaction.member.displayName}`))
            .catch(console.error);

        console.log("~~TEST HERE~~");
        console.log(name);
        await interaction.reply({ content: `Hello ${name}! ${_utils.getRandomEmoji()}`, ephemeral: true });
        await _utils.handleBotReply(interaction);
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

        await interaction.reply({ content: `See you next time ${orig}! ${_utils.getRandomEmoji()}`, ephemeral: true });
        await _utils.handleBotReply(interaction);
    });

    //////////////////////////////////////////////////////////////
    ///////////////// say ////////////////////////////////////////

    /**
     * @summary /say
     * @description speaks arg as user's character
     */
    responses.set(commands[3].name, async (interaction) => {
        await sendSay(interaction);
        /* TODO: in some cases interaction.reply has happened and is propagating up to this level... */
        await _utils.handleBotReply(interaction);
    });

    return responses;
};



// export const api = responses;
