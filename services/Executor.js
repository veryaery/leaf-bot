// community modules
const Promise = require("promise");
const { Parser } = require("xyncp");
const Discord = require("discord.js");
const chalk = require("chalk");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class Executor extends Service {

    constructor() {
        super("executor");

        this.dependencies = [ "bot", "commands", "weeb" ];
        this._logger = new Logger("executor", "green");
        this._services = {};
    }

    _sendError(channel, title, message) {
        channel.send({
            embed: new Discord.RichEmbed()
                .setTitle(title)
                .setDescription(message)
                .setColor(0x00ff99)
        });
    }

    load(config) {
        return new Promise((resolve, reject) => {
            this._services = require("../services.js").services;
            
            const parser = new Parser()
                .setCommands(this._services.commands.commands)
                .setSeparators([ " " ]);

            this._services.bot.client.on("message", (message) => {
                if (message.author.id != this._services.bot.client.user.id) {
                    if (message.content.startsWith(this._services.commands.prefix)) {
                        message.react("🍃");

                        parser.parse(message.content, {
                            message: message
                        })
                            .then(result => {
                                if (result.command == parser) {
                                    this._sendError(message.channel, "syntax error", "invalid command");
                                } else {
                                    if (result.error) {
                                        this._logger.log("", message.member.displayName, " failed to parse ", result.command.name);
                                        this._sendError(message.channel, "syntax error", result.error.message);
                                        return;
                                    } else if (result.command.nsfw && !message.channel.nsfw) {
                                        return this._sendError(message.channel, "error", "channel not nsfw");
                                    }
    
                                    this._logger.log("", message.member.displayName, " executing ", result.command.name);
                                    
                                    result.command.execute(result.output, message, this._services.bot.client)
                                        .then((error) => {
                                            if (error) {
                                                this._logger.log("", message.member.displayName, " failed executing ", result.command.name);
                                                this._sendError(message.channel, "error", error.message);
                                            } else {
                                                this._logger.log("", message.member.displayName, " successfully executed ", result.command.name);
                                            }
                                        })
                                        .catch((error) => {
                                            this._logger.logRaw(chalk.red(`error while executing ${result.command.name}`));
                                            console.error(error);
                                            this._sendError(message.channel, "internal error", "try again another time");
                                        });
                                    }
                            })
                            .catch(console.error);   
                    }
                }
            });

            this._logger.log("listening for commands");

            resolve();
        });
    }

}

// exports
module.exports = Executor;