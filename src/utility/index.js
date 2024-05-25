export class Utils {

    _emojis;
    _performance;

    constructor(emojis, performance) {
        this._emojis = emojis;
        this._performance = performance;
    }

    /**
     * @summary deletes required ephemeral reply
     */
    handleBotReply = async (interaction) => {
        await interaction.reply({ content: "3.. 2.. 1..", ephemeral: true });
        await interaction.deleteReply();
    };

    /**
     * @summary pass in ERRORS.MESSAGE as string for modular response for bot on User input error
     * @param {string} errMsg
     * @param {object} interaction
     */
    handleUserError = async (errMsg, interaction) => {
      await interaction.reply({ content: errMsg, ephemeral: true });
    };

    /**
     * @summary ensures user response to component (e.g. button) matches intended responder
     * @param {object} interaction
     * @returns filter callback for response.awaitMessageComponent({ filter: ..., time: 60_000 });
     */
    filterUserComponentResponse = async (interaction) => {
      return (i) => i.user.id === interaction.user.id;
    };

    /**
     * @param {string} str full discord user name
     * @returns the extracted character name ("nickname") for the user
     */
    extractNickname(str) {
      const match = str.match(/\[([^\]]+)\]/);
      return match ? match[1] : undefined;
    };

    /**
     * @returns a random emoji from src/data/emojis.js
     */
    getRandomEmoji = () => {
        var i = Math.floor(Math.random() * (9 - 1) + 1);
        return this._emojis[i];
    }

    /* ___________________________
    ______ LOGGERS _______________
    _____________________________ */

    logger = (payload) => {
      if (payload.isCommand) {
          /* _________________________
           *___ interaction author __*/
          const { displayName, id, joinedAt, nickname, permissions, roles } = payload.member;

          console.log(`\x1b[36m\x1b[0m`, `Author --
              \nDisplay Name/Nickname: ${displayName}/${nickname}
              \nID: ${id}
              \nMember Since: ${joinedAt}`);

          console.log(`\nRoles:\n`);

          if (roles.length)
            roles.forEach(r => console.log(r));

          console.log(`\nPermissions:\n`);

          if (permissions.length)
            permissions.forEach(p => console.log(p));

          /* _________________________
           *___ interaction type ____*/
          console.log(`\x1b[34m\x1b[0m`, `Interaction Type --
              \nisAnySelectMenu: ${payload.isAnySelectMenu()}
              \nisButton: ${payload.isButton()}
              \nisCommand: ${payload.isCommand()}
              \nisChatInputCommand: ${payload.isChatInputCommand()}
              \nisModalSubmit: ${payload.isModalSubmit()}`);

          console.log(`\nInteraction Entitlements --\n`);

          if (payload.entitlements.length)
            entitlements.forEach(e => console.log(e));

          /* _________________________
           *___ interaction locale __*/
          const { commandName, commandType, channel, channelId, createdAt, guildId } = payload;

          console.log(`\x1b[34m\x1b[0m`, `Interaction Context --
            \nCommand Name: ${commandName}
            \nCommand Type: ${commandType}
            \nChannel: ${channel}
            \nChannel ID: ${channelId}
            \nGuild ID: ${guildId}
            \nCreated At: ${createdAt}`);

          console.log(payload);

      } else if (payload.content) {
          /* _________________________
           *___ message author ______*/
          const { displayName, id, username } = payload.author;

          console.log(`\x1b[36m\x1b[0m`, `Message Author -- \n
              Display Name: ${displayName}\n
              Global Name: ${payload.author.globalName || ""}\n
              Username: ${username}\n
              ID: ${id}`);

          /* _________________________
           *___ message context _____*/
          const { channelId, content, createdAt, guildId } = payload;

          console.log(`\x1b[34m\x1b[0m`, `Message Context -- \n
              Channel ID: ${channelId}\n
              Guild ID: ${guildId}\n
              Created At: ${createdAt}\n`);
          console.log(`Message Content: ${content}`);
      }
  };

  logMessage = (message) => console.log(message);

  logInteraction = (interaction) => console.log(interaction);

    /**
     * @param operation an async callback. wrap all business logic to test inside an anonymous arrow function.
     * @constant `TIME.GOOD` (green) operation complete 1ms - 275ms
     * @constant `TIME.OK` (yellow) operation complete 275ms - 350ms
     * @constant `TIME.CONCERN` (orange) operation complete 350ms - 575ms
     * @constant `TIME.BAD` (red) operation complete +576ms
     *
     * @example Utility.performanceLog(async () => {
     *
     *   const userDTO: DTO.User = this._userContext.mapUserDTO(user);
     *   const userDoc: DocumentTypes.User = await this._userContext.findOrCreate(userDTO);
     *
     * });
     */
    performanceLog = async (operation) => {
      /* constants */
      const TIME = {
        GOOD: 275,
        OK: 350,
        CONCERN: 575,
        BAD: 556
      };

      const COL = {
        GOOD: "\x1b[32m%s\x1b[0m",
        OK: "\x1b[33m%s\x1b[0m",
        CONCERN: "\x1b[38;5;208m%s\x1b[0m",
        BAD: "\x1b[31m%s\x1b[0m"
      };

      /* execution */
      const startTime = performance.now();
      await operation();
      const endTime = performance.now();

      /* computation */
      const elapsedTime = endTime - startTime;
      const log = `Execution time: ${elapsedTime.toFixed(2)} ms`;

      if (elapsedTime <= TIME.GOOD) {
        console.log(COL.GOOD, log);
        return;
      } else if (elapsedTime <= TIME.OK) {
        console.log(COL.OK, log);
        return;
      } else if (elapsedTime <= TIME.CONCERN) {
        console.log(COL.CONCERN, log);
        return;
      } else {
        console.log(COL.BAD, log);
        return;
      }
    };

}