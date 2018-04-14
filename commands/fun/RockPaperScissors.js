// community modules
const { Command, Argument, types } = require("xyncp");

class RockPaperScissors extends Command {

    constructor() {
        super("rockpaperscissors");

        this.args = [
            new Argument("choice")
                .setType(new types.Either([ "rock", "paper", "scissors" ]))
        ];
        this.aliases = [ "rps" ];
        this._values = {
            rock: 0,
            paper: 1,
            scissors: 2
        };
        this._emojis = {
            0: "🗿",
            1: "📄",
            2: "✂"
        };
    }

    execute(output, message, client) {
        const botChoice = Math.floor(Math.random() * 3);
        const playerChoice = this._values[output.args.choice];
        const botEmoji = this._emojis[botChoice];
        const playerEmoji = this._emojis[playerChoice];

        if ((botChoice + 1) % 3 == playerChoice) {
            message.channel.send(`${playerEmoji}💥${botEmoji} you win`);
        } else if ((playerChoice + 1) % 3 == botChoice) {
            message.channel.send(`${playerEmoji}💥${botEmoji} you lose`);
        } else {
            message.channel.send(`${playerEmoji}💥${botEmoji} we tie`);
        }
    }

}

// exports
module.exports = RockPaperScissors;