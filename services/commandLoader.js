// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class CommandLoader extends Service {

    constructor() {
        super("commandLoader");

        this._logger = new Logger("command loader", "cyan");
    }

    load(config) {
        return new Promise((resolve, reject) => {
            const directory = "commands";
            const commands = [];

            fs.readdir(directory, (error, files) => {
                for (const file of files) {
                    const command = new (require(path.join(process.cwd(), directory, file)))();
                    
                    commands.push(command);

                    this._logger.log("loaded ", command.name);
                }

                CommandLoader.commands = commands;

                resolve();
            });
        });
    }

}

// statics
CommandLoader.commands = [];

// exports
module.exports = CommandLoader;