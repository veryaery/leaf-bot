// community modules
const { Parser } = require("xyncp");
const Discord = require("discord.js");

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
            if (message.author.id != Bot.client.user.id) {
                parser.parse(message.content, {
                    message: message
                })
                    .then(result => {
                        if (result.command != parser) {
                            message.react("🍃");

                            if (result.error) {
                                message.channel.send({
                                    embed: new Discord.RichEmbed()
                                        .setTitle("syntax error")
                                        .setDescription(result.error.message)
                                        .setColor(0x00ff99)
                                });

                                this._logger.log("", message.member.displayName, " failed to execute command ", result.command.name);
                            } else {
                                result.command.execute(result.output, message, Bot.client);
    
                                this._logger.log("", message.member.displayName, " successfully executed command ", result.command.name);
                            }
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