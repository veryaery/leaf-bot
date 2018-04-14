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

        this.defaults = {
            prefix: "//"
        };
        this._logger = new Logger("command loader", "cyan");
        this.catagories = [];
        this.commands = {};
        this.catagorizedCommands = {};
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
                this.catagories = await this._load("catagories");
                let commands = [];

                for (const catagory of this.catagories) {
                    try {
                        const catagoryCommands = await this._load(path.join("commands", catagory.name));

                        this._logger.log("loaded ", catagory.name, " with ", catagoryCommands.length, " commands");

                        this.catagorizedCommands[catagory.name] = {};
                        this.catagorizedCommands[catagory.name][config.prefix] = catagoryCommands;
                        commands = commands.concat(catagoryCommands);
                    } catch (error) {
                        reject(error);
                    }
                }

                this.commands[config.prefix] = commands;

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

}

// exports
module.exports = CommandLoader;