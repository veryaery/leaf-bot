// community modules
const { Command, Option, Argument, types } = require("xyncp");

class Random extends Command {

    constructor() {
        super("random");

        this.options = {
            "--": [
                new Option("min")
                    .setArgs([
                        new Argument("number")
                            .setType(new types.Num())
                    ]),
                new Option("max")
                    .setArgs([
                        new Argument("number")
                            .setType(new types.Num())
                    ]),
                new Option("float")
            ]
        }
        this.aliases = [ "rand", "rnd", "r", "gen" ];
    }

    execute(output, message, client) {
        message.channel.send(JSON.stringify(output));
    }

}

// exports
module.exports = Random;