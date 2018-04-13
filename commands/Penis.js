// community modules
const { Command, Argument } = require("xyncp");
const Discord = require("discord.js");
const { Noise } = require("noisejs");

// imports
const Mention = require("../types/Mention.js");
const methods = require("../methods.js");

class Penis extends Command {

    constructor() {
        super("penis");

        this.args = [
            new Argument("member")
                .setType(new Mention("member"))
                .setOptional(true)
        ];
        this.aliases = [ "dick", "length", "size" ]
        this._min = 2;
        this._max = 30;
        this._noise = new Noise(Math.random());
    }

    execute(output, message, client) {
        const member = output.args.member || message.member;
        const seed = methods.numberize(member.id);
        const size = Math.round(((Math.abs(this._noise.simplex2(Date.now() / 1000000, seed)) * (this._max - this._min)) + this._min) * 10) / 10;

        let penis = "B";
        for (let i = 0; i < size; i += 2) {
            penis += "=";
        }
        penis += "D";

        message.channel.send(`${penis} \`${size}cm\` (\`${(Math.round((size * 0.393701) * 10)) / 10}'\`)`)
    }

}

// exports
module.exports = Penis;