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

    _load(directory) {
        return new Promise((resolve, reject) => {
            const output = [];

            fs.readdir(directory, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    for (const file of files) {
                        output.push(new (require(path.join(process.cwd(), directory, file)))());
                    }

                    resolve(output);
                }
            });
        });
    }

    async load(config) {
        return new Promise(async (resolve, reject) => {
            try {
                CommandLoader.catagories = await this._load("catagories");
                let commands = [];

                for (const catagory of CommandLoader.catagories) {
                    try {
                        const name = catagory.name;
                        const catagoryCommands = await this._load(path.join("commands", name));

                        this._logger.log("loaded ", name, " with ", catagoryCommands.length, " commands");

                        CommandLoader.catagorizedCommands[name] = catagoryCommands;
                        commands = commands.concat(catagoryCommands);
                    } catch (error) {
                        reject(error);
                    }
                }

                CommandLoader.commands = commands;

                resolve();
            } catch (error) {
                reject(error);
            }
            /*
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
            */
        });
    }

}

// statics
CommandLoader.catagories = [];
CommandLoader.commands = [];
CommandLoader.catagorizedCommands = {};

// exports
module.exports = CommandLoader;