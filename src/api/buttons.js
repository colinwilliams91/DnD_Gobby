import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/**
 * @summary example sendButton template
 */
export const sendButton = async (interaction) => {
    const confirm = new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
	    .addComponents(confirm);

    await interaction.reply({
        content: "This is a test button...",
        components: [row]
    });
};

// const row = new ActionRowBuilder()
// 	.addComponents(confirm);

// await interaction.reply({
//     content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
//     components: [row],
// });