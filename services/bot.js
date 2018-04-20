// community modules
const Promise = require("promise");
const Discord = require("discord.js");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class Bot extends Service {

    constructor() {
        super("bot");

        this.dependencies = [ "commands" ];
        this.defaults = {
            token: "",
            game: {
                name: "",
                type: "PLAYING",
                url: ""
            }
        };
        this._logger = new Logger("bot", "magenta");
        this.client = null;
    }

    load(config) {
        return new Promise((resolve, reject) => {
            const client = new Discord.Client();
    
            client.on("ready", () => {
                this.client = client;

                this._logger.log("ready");
                client.user.setPresence({
                    game: config.game
                });

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