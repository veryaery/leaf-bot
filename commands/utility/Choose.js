// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");

class Choose extends Command {

    constructor() {
        super("choose");

        this.args = [
            new Argument("options")
                .setType(new types.List(new types.Str(), {
                    min: 2
                }))
        ];
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            message.channel.send(`🤔 ${output.args.options[Math.floor(Math.random() * output.args.options.length)]}`)
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = Choose;