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