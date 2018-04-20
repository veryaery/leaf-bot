// community modules
const { Command, Argument, types } = require("xyncp");
const Promise = require("promise");

class Echo extends Command {

    constructor() {
        super("echo");

        this.args = [
            new Argument("message")
                .setType(new types.Raw())
        ];
        this.aliases = [ "say" ];
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            message.channel.send(output.args.message)
                .then((message) => resolve())
                .catch(reject);
        });
    }

}

// exports
module.exports = Echo;