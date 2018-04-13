// community modules
const { Command } = require("xyncp");

class Ping extends Command {

    constructor() {
        super("ping");
    }

    execute(output, message, client) {
        const past = Date.now();

        message.channel.send("🏓 ping")
            .then((message) => {
                message.edit(`🏓 pong\n\nwebsocket: \`${Math.round(client.ping)}ms\`\nrest: \`${Date.now() - past}ms\``)
            });
    }

}

// exports
module.exports = Ping;