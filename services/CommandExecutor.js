// community modules
const { Parser } = require("xyncp");

// imports
const Service = require("../classes/Service.js");
const CommandLoader = require("../services/CommandLoader.js");
const Bot = require("../services/Bot.js");

class CommandExecutor extends Service {

    constructor() {
        super("commandExecutor");

        this.dependencies = [ "bot", "commandLoader" ];
        this.defaults = {
            prefix: "//"
        };
    }

    load(config) {
        const parser = new Parser()
            .setCommands(CommandLoader.commands);

        Bot.client.on("message", (message) => {
            parser.parse(message.content)
                .then(result => {
                    console.log(error);
                })
                .catch(console.error);
        });
    }

}

// exports
module.exports = CommandExecutor;