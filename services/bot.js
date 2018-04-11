// community modules
const Promise = require("promise");
const Discord = require("discord.js");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class Bot extends Service {

    constructor() {
        super("bot");

        this.dependencies = [ "commandLoader" ];
        this.defaults = {
            token: ""
        };
        this._logger = new Logger("bot", "magenta");
    }

    load(config) {
        return new Promise((resolve, reject) => {
            const client = new Discord.Client();
    
            client.on("ready", () => {
                this._logger.log("ready");

                Bot.client = client;

                resolve();
            });

            client.login(config.token)
                .then(() => {
                    this._logger.log("connected to discord");
                })
                .catch(console.error);
        });
    }

}

// exports
module.exports = Bot;