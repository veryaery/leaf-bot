// community modules
const { Parser } = require("xyncp");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");
const CommandLoader = require("../services/CommandLoader.js");
const Bot = require("../services/Bot.js");

class CommandExecutor extends Service {

    constructor() {
        super("commandExecutor");

        this.dependencies = [ "bot", "commandLoader" ];
        this.defaults = {
            prefix: "//"
        };
        this._logger = new Logger("command executor", "green");
    }

    load(config) {
        const commands = {};
        commands[config.prefix] = CommandLoader.commands;
        const parser = new Parser()
            .setCommands(commands)
            .setSeparators([ " " ]);

        Bot.client.on("message", (message) => {
            if (message.author.id != Bot.client.id) {
                parser.parse(message.content, {})
                    .then(result => {
                        if (result.command != parser) {
                            result.command.execute(result.output, message, Bot.client);

                            this._logger.log("", message.member.displayName, " executed command ", result.command.name);
                        }
                    })
                    .catch(console.error);
            }
        });

        this._logger.log("listening");
    }

}

// exports
module.exports = CommandExecutor;