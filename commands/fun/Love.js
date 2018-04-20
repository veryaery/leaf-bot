// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");
const Discord = require("discord.js");
const { Noise } = require("noisejs");

// imports
const Mention = require("../../types/Mention.js");
const methods = require("../../methods.js");

class Love extends Command {

    constructor() {
        super("love");

        this.args = [
            new Argument("subject")
                .setType(new types.Either([
                    new Mention("member"),
                    new types.Str()
                ])),
            new Argument("object")
                .setType(new types.Either([
                    new Mention("member"),
                    new types.Str()
                ]))
        ];
        this._noise = new Noise(Math.random());
    }

    _normalize(input) {
        return input.replace(/[^0-9a-z]/gi, "").toLowerCase();
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            const subject = typeof output.args.subject == "string" ? output.args.subject : output.args.subject.user.username;
            const object = typeof output.args.object == "string" ? output.args.object : output.args.object.user.username;
            const seed = methods.numberize(this._normalize(subject) + this._normalize(object));
            const love = Math.round(Math.abs(this._noise.simplex2(Date.now() / 1000000, seed)) * 100);
    
            message.channel.send(`${subject} ❤️ \`${love}%\` ❤️ ${object}`)
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = Love;