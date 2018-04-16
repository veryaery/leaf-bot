// core modules
const path = require("path");
const fs = require("fs");

// communuity modules
const Promise = require("promise");
const { Command, Argument } = require("xyncp");

// imports
const Service = require("../classes/Service.js");

class Weeb extends Service {

    constructor() {
        super("weeb");

        this.dependencies = [ "commands" ];
        this._directory = path.join(process.cwd(), "commands", "weeb");
        this._services = {};
    }

    _registerCommand(name) {
        const command = new Command(name);
    }

    _registerCommands() {
        return new Promise((resolve, reject) => {
            fs.readdir(this._directory, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    for (const file of files) {
                        if (!path.extname(file)) {
                            this._registerCommand(file);
                        }
                    }

                    resolve();
                }
            });
        });
    }

    load(config) {
        return new Promise((resolve, reject) => {
            this._services = require("../services.js").services;

            this._registerCommands()
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Weeb;