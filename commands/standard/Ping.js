// community modules
const { Command } = require("xyncp");
const Promise = require("promise");

class Ping extends Command {

    constructor() {
        super("ping");
    }

    execute(output, message, client) {
        return new Promise((resolve, reject) => {
            const past = Date.now();
    
            message.channel.send("🏓 ping")
                .then((message) => {
                    message.edit(`🏓 pong\n\nwebsocket: \`${Math.round(client.ping)}ms\`\nrest: \`${Date.now() - past}ms\``)
                        .then((message) => resolve())
                        .catch(reject);
                })
                .catch(reject);
        });
    }

}

// exports
module.exports = Ping;