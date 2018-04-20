// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");

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
        return new Promise((resolve, reject) => {
            const botChoice = Math.floor(Math.random() * 3);
            const playerChoice = this._values[output.args.choice];
            const botEmoji = this._emojis[botChoice];
            const playerEmoji = this._emojis[playerChoice];
            let resultMessage = "";
    
            if ((botChoice + 1) % 3 == playerChoice) {
                resultMessage = "you win";
            } else if ((playerChoice + 1) % 3 == botChoice) {
                resultMessage = "you lose";
            } else {
                resultMessage = "we tie";
            }

            message.channel.send(`${playerEmoji}💥${botEmoji} ${resultMessage}`)
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = RockPaperScissors;