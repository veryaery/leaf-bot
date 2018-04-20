// community modules
const { Command, Option, Argument, types } = require("xyncp");
const Promise = require("promise");

class Dice extends Command {

    constructor() {
        super("dice");

        this.args = [
            new Argument("sides")
                .setType(new types.Num({
                    min: 1,
                    integer: true
                }))
                .setOptional(true)
        ];
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
        this.aliases = [ "roll" ];
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            const sides = output.args.sides === undefined ? 6 : output.args.sides;
            const count = output.options.count === undefined ? 1 : output.options.count.count;
            const values = [];
    
            for (let i = 0; i < count; i++) {
                values.push(`🎲 ${Math.floor(Math.random() * sides) + 1}`);
            }
    
            message.channel.send(values.join("\n"))
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = Dice;