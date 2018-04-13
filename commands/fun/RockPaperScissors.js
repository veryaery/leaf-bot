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
            0: ":moyai:",
            1: ":scroll:",
            2: ":scissors:"
        };
    }

    execute(output, message, client) {
        const botChoice = Math.floor(Math.random() * 3);
        const playerChoice = this._values[output.args.choice];
        const emoji = this._emojis[botChoice];

        if ((botChoice + 1) % 3 == playerChoice) {
            message.channel.send(`${emoji} you win`);
        } else if ((playerChoice + 1) % 3 == botChoice) {
            message.channel.send(`${emoji} you lose`);
        } else {
            message.channel.send(`${emoji} we tie`);
        }
    }

}

// exports
module.exports = RockPaperScissors;