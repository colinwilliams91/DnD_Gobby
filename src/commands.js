import { SlashCommandBuilder } from "discord.js";

/**
 * @abstract array of commands
 * @generator `SlashCommandBuilder` - A builder that creates API-compatible JSON data for slash commands.
 * @example old commands API: `{ name: "", description: "", options: {} }`
 */
export default [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    new SlashCommandBuilder().setName("test").setDescription("Replies with test!"),
];
