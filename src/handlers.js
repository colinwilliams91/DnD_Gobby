export class EventHandlers {

    _emojis;
    _utils;

    constructor(emojis, utils) {
        this._emojis = emojis;
        this._utils = utils;
    }

    updateUserNickname = async (message, prefix) => {
        const emoji = this._utils.getRandomEmoji();

        // TODO: business logic to change user-nickname..
        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!😵`);
		}

        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        message.channel.send(`Nickname for user: ${message.author.globalName} updated. ${emoji}`);

    }

    logMessage = (message) => {
        console.log(message);
    };

    reactToMessage = (message) => {
        const emoji = this._utils.getRandomEmoji();
        message.react(emoji);
    };
}