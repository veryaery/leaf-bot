// community modules
const { Command, Argument, types } = require("xyncp");

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
        message.channel.send(output.args.message);
    }

}

// exports
module.exports = Echo;