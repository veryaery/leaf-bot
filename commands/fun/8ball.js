// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");

class Ball extends Command {

    constructor() {
        super("8ball");

        this.args = [
            new Argument("question")
                .setType(new types.Raw())
        ];
        this._fortunes = [
            "it is certain", "as i see it, yes", "it is decidedly so",
            "most likely", "without a doubt", "outlook good",
            "yes definitely", "yes", "you may rely on it",
            "signs point to yes", "reply hazy try again", "ask again later",
            "better not tell you now", "cannot predict now", "concentrate and ask again",
            "don't count on it", "my reply is no", "my sources say no",
            "outlook not so good", "very doubtful"
        ];
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            message.channel.send(`🎱 ${this._fortunes[Math.floor(Math.random() * this._fortunes.length)]}`)
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = Ball;