// community modules
const { Command, Option, Argument, types } = require("xyncp");

class Random extends Command {

    constructor() {
        super("random");

        this.args = [
            new Argument("min")
                .setType(new types.Num())
                .setOptional(true),
            new Argument("max")
                .setType(new types.Num())
                .setOptional(true)
        ];
        this.options = {
            "--": [
                new Option("float")
                    .setAliases([ "f" ]),
                new Option("count")
                    .setAliases([ "c", "amount", "a" ])
                    .setArgs([
                        new Argument("number")
                            .setType(new types.Num({
                                min: 1,
                                max: 10,
                                integer: true
                            }))
                    ])
            ]
        }
        this.aliases = [ "rand", "rnd", "gen" ];
    }

    execute(output, message, client) {
        const min = output.args.min === undefined ? 1 : output.args.min;
        const max = output.args.max === undefined ? 10 : output.args.max;
        const count = output.options.count ? output.options.count.number : 1;
        const values = [];

        for (let i = 0; i < count; i++) {
            const value = (Math.random() * (max - min)) + min;

            values.push(output.options.float ? value : Math.round(value));
        }

        message.channel.send(values.join("\n"));
    }

}

// exports
module.exports = Random;