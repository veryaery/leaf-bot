// community modules
const { Command } = require("xyncp");

class Ping extends Command {

    constructor() {
        super("ping");
    }

    execute(output, message, client) {
        const past = Date.now();

        message.channel.send("pong")
            .then((message) => {
                message.edit(`pong\n\nwebsocket: \`${client.ping}ms\`\nrest: \`${Date.now() - past}ms\``)
            });
    }

}

// exports
module.exports = Ping;