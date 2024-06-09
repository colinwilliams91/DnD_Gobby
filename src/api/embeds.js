import { EmbedBuilder } from "discord.js";
import { _utils } from "../index.js";

import { AVATARS, LOCATIONS } from "../data/index.js";
import { ERRORS } from "../errors/index.js";

/* TODO: should be migrated out into handlers or some other file? ^ v */
import { sendButton } from "./buttons.js";
import dotenv from "dotenv";
dotenv.config();


/**
 * @example
 * @param {object} interaction payload from discord event
 */
export const sendEmbed = async (interaction) => {
    // inside a command, event listener, etc.
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Some title")
        .setURL("https://discord.js.org/")
        .setAuthor({ name: "Some name", iconURL: "https://i.imgur.com/AfFp7pu.png", url: "https://discord.js.org" })
        .setDescription("Some description here")
        .setThumbnail("https://i.imgur.com/AfFp7pu.png")
        .addFields(
            { name: "Regular field title", value: "Some value here" },
            { name: "\u200B", value: "\u200B" },
            { name: "Inline field title", value: "Some value here", inline: true },
            { name: "Inline field title", value: "Some value here", inline: true },
        )
        .addFields({ name: "Inline field title", value: "Some value here", inline: true })
        .setImage("https://i.imgur.com/AfFp7pu.png")
        .setTimestamp()
        .setFooter({ text: "Some footer text here", iconURL: "https://i.imgur.com/AfFp7pu.png" });

    await interaction.channel.send({ embeds: [ exampleEmbed ] });
};

export const sendSay = async (interaction) => {
    const input = interaction.options.getString("message");

    const charName = _utils.extractNickname(interaction.member.nickname);

    // TODO: test error cases...
    if (!charName) {
        // const { id } = interaction.member;

        // await interaction.reply({ content: ERRORS.NO_NAME, ephemeral: true });
        /* was using this if block to test sending button... */
        // if (id === process.env.MY_ID || id === process.env.ADMIN_ID) {
        //     await sendButton(interaction);
        //     return;
        // }

        await _utils.handleUserError(ERRORS.NO_NAME, interaction);
        return;
    }

    // TODO: handle null | undefined .member.avatar... currently placeholders Bot Avatar...
    const charAvatar = AVATARS.get(charName)
        ? AVATARS.get(charName)
        : interaction.member.avatar
            ? interaction.member.avatar
            : AVATARS.get("Bot");

    // TODO: once ALL users have Character/Avatars stored in code, then use this...
    // const charAvatar = AVATARS.get(charName);
    // if (!charAvatar) {
    //     await _utils.handleUserError(ERRORS.NO_AVATAR, interaction);
    //     return;
    // }

    const sayEmbed = new EmbedBuilder()
        .setColor(0x00CC00)
        .setAuthor({ name: charName, iconURL: charAvatar })
        .setDescription(input)
        // .setThumbnail(AVATARS.get("Bot"))
        // .setImage(LOCATIONS.get("Crossroads"))
        .setTimestamp()
        // .setFooter({ text: "What should go here... the weather?", iconURL: AVATARS.get("Bot") });

    await interaction.channel.send({ embeds: [ sayEmbed ] });
};