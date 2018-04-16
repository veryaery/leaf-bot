// community modules
const { Command, Option, Argument, types } = require("xyncp");

class Coin extends Command {

    constructor() {
        super("coin");

        this.options = {
            "--": [
                new Option("count")
                    .setAliases([ "amount" ])
                    .setArgs([
                        new Argument("count")
                            .setType(new types.Num({
                                min: 1,
                                max: 12,
                                integer: true
                            }))
                    ])
            ]
        }
        this.aliases = [ "flip" ];
    }

    execute(output, message, client) {
        const count = output.options.count === undefined ? 1 : output.options.count.count;
        const values = [];

        for (let i = 0; i < count; i++) {
            values.push(Math.random() > 0.5 ? "heads" : "tails");
        }

        message.channel.send(values.join("\n"));
    }

}

// exports
module.exports = Coin;