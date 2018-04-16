// community modules
const { Parser } = require("xyncp");
const Discord = require("discord.js");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class Executor extends Service {

    constructor() {
        super("executor");

        this.dependencies = [ "bot", "commands" ];
        this._logger = new Logger("executor", "green");
        this._services = {};
    }

    load(config) {
        this._services = require("../services.js").services;
        
        const parser = new Parser()
            .setCommands(this._services.commands.commands)
            .setSeparators([ " " ]);

        this._services.bot.client.on("message", (message) => {
            if (message.author.id != this._services.bot.client.user.id) {
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
                                result.command.execute(result.output, message, this._services.bot.client);
    
                                this._logger.log("", message.member.displayName, " successfully executed command ", result.command.name);
                            }
                        }
                    })
                    .catch(console.error);
            }
        });

        this._logger.log("listening for commands");
    }

}

// exports
module.exports = Executor;