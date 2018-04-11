// community modules
const { Command } = require("xyncp");

class Ping extends Command {

    constructor() {
        super("ping");

        this.aliases = [ "p" ];
    }

    execute(output, message, client) {
        message.channel.send("pong");
    }

}

// exports
module.exports = Ping;