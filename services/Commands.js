// core modules
const fs = require("fs");
const path = require("path");

// community modules
const Promise = require("promise");
const xyncl = require("xyncl");

// imports
const Service = require("../classes/Service.js");
const Logger = require("../classes/Logger.js");

class Commands extends Service {

    constructor() {
        super("commands");

        this.defaults = {
            prefix: "//"
        };
        this._logger = new Logger("commands", "cyan");
        this._directory = "commands";
        this.prefix = "";
        this.catagories = {};
        this.commands = {};
    }

    async _readCatagory(catagory) {
        return new Promise(async (resolve, reject) => {
            const directory = path.join(process.cwd(), this._directory, catagory);

            try {
                const options = {};
                options[path.join(directory, `${catagory}.json`)] = null;
                const config = (await xyncl(options))[catagory];

                this.catagories[catagory] = {
                    ...config,
                    name: catagory,
                    commands: {}
                };

                fs.readdir(directory, (error, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (const file of files) {
                            const extname = path.extname(file);

                            if (extname.slice(1, extname.length) == "js") {
                                try {
                                    this.register(catagory, new (require(path.join(directory, file)))());
                                } catch (error) {
                                    return reject(error);
                                }
                            }
                        }

                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async _readCatagories() {
        return new Promise(async (resolve, reject) => {
            fs.readdir(this._directory, async (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    for (const catagory of files) {
                        try {
                            await this._readCatagory(catagory);
                        } catch (error) {
                            return reject(error);
                        }
                    }

                    resolve();
                }
            });
        });
    }

    register(catagory, command) {
        if (!this.commands[this.prefix]) {
            this.commands[this.prefix] = [];
        }

        this.commands[this.prefix].push(command);

        if (!this.catagories[catagory].commands[this.prefix]) {
            this.catagories[catagory].commands[this.prefix] = [];
        }

        this.catagories[catagory].commands[this.prefix].push(command);

        this._logger.log("registered ", command.name, " to ", catagory);
    }

    load(config) {
        return new Promise((resolve, reject) => {
            this.prefix = config.prefix;

            this._readCatagories()
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Commands;