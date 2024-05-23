import { EmbedBuilder } from "discord.js";
import { AVATARS, LOCATIONS } from "../data/index.js";


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

    await interaction.channel.send({ embeds: [exampleEmbed] });
};

export const sendSay = async (interaction) => {
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        // .setTitle("Some title")
        // .setURL("https://discord.js.org/")
        .setAuthor({ name: "DnD_Gobby", iconURL: AVATARS.get("Bot") })
        .setDescription("Should this be the chat message?")
        .setThumbnail(AVATARS.get("Bot"))
        .addFields(
            { name: "Regular field title", value: "Some value here" },
            // { name: "\u200B", value: "\u200B" },
            // { name: "Inline field title", value: "Some value here", inline: true },
            // { name: "Inline field title", value: "Some value here", inline: true },
        )
        // .addFields({ name: "Inline field title", value: "Some value here", inline: true })
        .setImage(LOCATIONS.get("Crossroads"))
        .setTimestamp()
        .setFooter({ text: "What should go here... the weather?", iconURL: AVATARS.get("Bot") });

    await interaction.channel.send({ embeds: [exampleEmbed] });
};