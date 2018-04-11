// community modules
const { Command } = require("xyncp");

class Ping extends Command {

    constructor() {
        super("ping");
    }

    execute(output, message, client) {
        message.channel.send("pong");
    }

}

// exports
module.exports = Ping;