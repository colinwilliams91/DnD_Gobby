export class EventHandlers {

    _emojis;

    constructor(emojis) {
        this._emojis = emojis;
    }

    handleNameInput = async (message, prefix) => {

        if (!message.content.startsWith(prefix) || message.author.bot) {
            console.error(`calling incorrect handler: handleNameInput for ${message}`);
            return;
        }

        // TODO: business logic to change user-nickname..
        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}

        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        message.channel.send(`Nickname for user: ${message.author.globalName} updated. `);

    }
}